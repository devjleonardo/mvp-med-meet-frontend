document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    var forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                Array.from(form.querySelectorAll(':invalid')).forEach(function(element) {
                    element.classList.add('is-invalid');
                });
                Array.from(form.querySelectorAll(':valid')).forEach(function(element) {
                    element.classList.remove('is-invalid');
                });
            }
            form.classList.add('was-validated');
        }, false);

        Array.from(form.querySelectorAll('.form-control')).forEach(function(input) {
            input.addEventListener('input', function() {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                } else {
                    input.classList.add('is-invalid');
                }
            });
        });
    });
});