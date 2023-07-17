import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";

export default apiInitializer("0.11.1", (api) => {
  api.addPostMenuButton("copy", () => {
    return {
      action: "copyLink",
      icon: "copy",
      className: "copy-link",
      title: themePrefix("copy_title"),
      position: "second",
    };
  });

  api.attachWidgetAction("post", "copyLink", function () {
    let postUrl = this.attrs.shareUrl;
    let shareUrl = new URL(postUrl, window.origin).toString();
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        createAlert("Link copied!", "success");
      },
      () => {
        createAlert("Failed to copy link.", "fail");
      }
    );
  });

  function createAlert(message, type) {
    let alertDiv = document.createElement("div");
    alertDiv.className =
      "link-copied-alert" + (type === "success" ? " -success" : " -fail");
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    alertDiv.classList.add("is-visible");
    setTimeout(function () {
      alertDiv.classList.remove("is-visible");
    }, 1500);

    setTimeout(function () {
      document.body.removeChild(alertDiv);
    }, 2000);
  }
});
