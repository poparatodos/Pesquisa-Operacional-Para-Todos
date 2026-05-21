document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.navbar__toggle');
    const dropdown = document.querySelector('.navbar__dropdown');
    const backdrop = document.querySelector('.navbar__backdrop');

    if (!toggle || !dropdown || !backdrop) return;

    function openMenu() {
        dropdown.classList.add('open');
        backdrop.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        dropdown.classList.remove('open');
        backdrop.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
        dropdown.classList.contains('open') ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    dropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
