import { apiInitializer } from "discourse/lib/api";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export default apiInitializer("0.11.1", (api) => {
  if (api.container.lookup("service:site").desktopView) {
    let position = "second";

    api.removePostMenuButton("share", () => {
      return true;
    });

    api.addPostMenuButton("copy", () => {
      return {
        action: "copyLink",
        icon: "d-post-share",
        className: "post-action-menu__copy-link",
        title: themePrefix("copy_title"),
        position,
      };
    });

    api.attachWidgetAction("post", "copyLink", function () {
      const postUrl = this.attrs.shareUrl;
      const postId = this.attrs.id;
      const postSelector = `article[data-post-id='${postId}']`;

      if (
        document.querySelector(
          `${postSelector} .post-action-menu__copy-link .post-action-menu__copylink-checkmark`
        )
      ) {
        return;
      }

      const shareUrl = new URL(postUrl, window.origin).toString();
      const copyLinkBtn = document.querySelector(
        `${postSelector} .post-action-menu__copy-link`
      );

      navigator.clipboard.writeText(shareUrl).then(
        () => {
          createAlert("Link copied!", "success", postId);
          createCheckmark(copyLinkBtn, postId);
          styleLinkBtn(copyLinkBtn);
        },
        () => {
          createAlert("Failed to copy link.", "fail");
        }
      );
    });
  }
});

function createAlert(message, type, postId) {
  const postSelector = `article[data-post-id='${postId}'] .post-action-menu__copy-link`;
  let post = document.querySelector(postSelector);

  if (!post) {
    return;
  }

  let alertDiv = document.createElement("div");
  alertDiv.className =
    "link-copied-alert" + (type === "success" ? " -success" : " -fail");
  alertDiv.textContent = message;

  post.appendChild(alertDiv);

  setTimeout(() => alertDiv.classList.add("slide-out"), 1000);
  setTimeout(() => removeElement(postSelector, alertDiv), 2500);
}

function createCheckmark(btn, postId) {
  const checkmark = makeSvg(postId);
  btn.appendChild(checkmark);

  setTimeout(() => checkmark.classList.remove("is-visible"), 3000);
  setTimeout(() => removeElement(`#postId_${postId}`), 3500);
}

function styleLinkBtn(btn) {
  btn.classList.add("is-copied");
  setTimeout(() => btn.classList.remove("is-copied"), 3200);
}

function makeSvg(postId) {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("class", "post-action-menu__copylink-checkmark is-visible");
  svg.setAttribute("id", `postId_${postId}`);
  svg.setAttribute("xmlns", SVG_NAMESPACE);
  svg.setAttribute("viewBox", "0 0 52 52");
  svg.innerHTML = `<path class="checkmark__check" fill="none" d="M13 26 l10 10 20 -20"/>`;

  return svg;
}

function removeElement(selector, element = document.querySelector(selector)) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}
