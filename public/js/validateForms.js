(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".validated-form");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          //ngăn submit
          event.preventDefault();
          //ngăn báo lỗi lên components cấp trên
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
