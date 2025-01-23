document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-link");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Active le bon onglet et cache les autres
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            tabPanes.forEach(pane => {
                if (pane.id === tab.dataset.tab) {
                    pane.classList.add("active");
                } else {
                    pane.classList.remove("active");
                }
            });
        });
    });
});

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        if (content && content.classList.contains('content')) {
            content.classList.toggle('hidden');
        }
    });
});
