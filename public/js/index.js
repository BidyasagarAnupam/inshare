const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");
const percentDiv = document.querySelector("#percent");

const fileURLInput = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");

const emailForm = document.querySelector("#email-form");

const toast = document.querySelector(".toast");

const maxAllowedSize = 100 * 1024 * 1024; //100mb

const host = "https://bs-inshare.herokuapp.com/";
// const host = "http://localhost:3000/";
const uploadURL = host + "api/files";
const emailURL = host + "api/files/send";

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  console.log(files);
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

copyBtn.addEventListener("click", (e) => {
  fileURLInput.select();
  document.execCommand("copy");
  showToast("Link copied 🔗🎉");
});

const uploadFile = () => {
  if (fileInput.files.length > 1) {
    resetFileInput();
    showToast("⚠ Only uppload one file");
    return;
  }
  const file = fileInput.files[0];

  if (file.size > maxAllowedSize) {
    resetFileInput();
    showToast("⚠ Can't upload more than 100 mb");
    return;
  }

  progressContainer.style.display = "block";

  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.upload.onerror = (e) => {
    progressContainer.style.display = "none";
    resetFileInput();
    showToast(`Error in upload: ${xhr.statusText}`);
    console.log(xhr.statusText);
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};
//  for testing
// const sleep = (milliseconds) => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds))
// }
const updateProgress = async (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  // console.log(percent);

  // for testing
  // for (var percent = 0; percent <= 100; percent++) {
  // await sleep(100);
  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
  // }
};
// updateProgress();

const onUploadSuccess = ({ file: url }) => {
  console.log(url);
  resetFileInput();
  emailForm[2].removeAttribute("disabled", "true");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  showToast("Upload Success🤩");
  fileURLInput.value = url;
};

const resetFileInput = () => {
  fileInput.value = "";
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = fileURLInput.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

  console.table(formData);
  emailForm[2].setAttribute("disabled", "true");
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        sharingContainer.style.display = "none";
        showToast("Email Sent🎉");
      } else {
        showToast("Email not Sent😢");

      }
    });
});

let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate( -50% ,0)";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate( -50% ,60px)";
  }, 2000);
};
