document.querySelectorAll('[data-expand-reading]').forEach((button) => {
    const content = document.getElementById(button.getAttribute('aria-controls'));

    if (!content) return;

    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isExpanded));
        content.hidden = isExpanded;
    });
});
