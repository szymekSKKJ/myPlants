const createNotification = (content, isPositive) => {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add(`main-notification`);
  notificationElement.innerHTML = `<p>${content}</p>`;
  document.body.appendChild(notificationElement);

  setTimeout(() => {
    notificationElement.style.animation = "unset";
    notificationElement.style.transform = "translate(0px, 0%)";
    setTimeout(() => {
      notificationElement.style.animation = "apear-notification 500ms forwards reverse";
      setTimeout(() => {
        notificationElement.remove();
      }, 500);
    }, 3000);
  }, 500);
};

export default createNotification;
