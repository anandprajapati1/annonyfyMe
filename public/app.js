document.addEventListener("DOMContentLoaded", e => {
	// const app = firebase.app();
	// getDataFromFirestore();
	getLiveDataFromFirestore();
})

/**
 * Returns live data stream 
 * i.e. Whenever data changes at cloud, it reflects in realtime on your app
 */
function getLiveDataFromFirestore() {
    const db = firebase.firestore();
    //var docRef = firestore.collection("conversations");
	const myusers = db.collection("conversations");
	// console.log(myusers)

	myusers.get().then(x => {
		x.forEach(z => {
			console.log(z.data())
		})
	})
}

function getDataFromFirestore() {
	const db = firebase.firestore();
	const settings = {
		timestampsInSnapshots: true
	};
	db.settings(settings);
	const myusers = db.collection("Users");
	// console.log(myusers)

	myusers.get().then(x => {
		x.forEach(z => {
			console.log(z.data())
		})
	})
}

function deactivateUser(id) {
	const db = firebase.firestore();
	const users=db.collection("Users");
	// var batch = db.batch();

	users.doc(id).update({IsActive: false});
}

function loginWithGoogle() {
	const firebaseAuth = firebase.auth();
	const provider = new firebase.auth.GoogleAuthProvider();
	firebaseAuth.signInWithPopup(provider).then(result => {
		// console.log(result);
		let img = document.createElement("img");
		let label = document.createElement("label");
		img.setAttribute("src", result.additionalUserInfo.profile.picture);
		img.setAttribute("style", "max-width:100%");
		label.innerText = `Hello ${result.additionalUserInfo.profile.name}`;
		document.getElementsByClassName("logged-in")[0].appendChild(img)
		document.getElementsByClassName("logged-in")[0].appendChild(label)
	});
}

function loginWithPhone(){
	// const firebaseAuth = firebase.auth();
	firebase.auth().useDeviceLanguage();

	// Turn off phone auth app verification.
	firebase.auth().settings.appVerificationDisabledForTesting = true;

	var phoneNumber = "+918802217279";
	var testVerificationCode = "123456";

	// This will render a fake reCAPTCHA as appVerificationDisabledForTesting is true.
	// This will resolve after rendering without app verification.
	var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
	// signInWithPhoneNumber will call appVerifier.verify() which will resolve with a fake
	// reCAPTCHA response.
	firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      // confirmationResult can resolve with the whitelisted testVerificationCode above.
      return confirmationResult.confirm(testVerificationCode)
    }).catch(function (error) {
		console.log('Error; SMS not sent');
    });
}