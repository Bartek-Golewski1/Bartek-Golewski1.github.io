interface AppStyle {
    name: string;
    file: string;
}

const styles: AppStyle[] = [
    { name: "Styl 1", file: "style-1.css" },
    { name: "Styl 2", file: "style-2.css" },
    { name: "Styl 3", file: "style-3.css" }
];

let currentStyle: AppStyle = styles[0];
let currentLinkElement: HTMLLinkElement | null = null;

function applyStyle(style: AppStyle) {
    if (currentLinkElement) {
        document.head.removeChild(currentLinkElement);
    }
    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = `/${style.file}`;
    document.head.appendChild(newLink);
    currentStyle = style;
    currentLinkElement = newLink;
}

function renderStyleSwitcher() {
    const container = document.getElementById('style-switch');

    if (!container) {
        console.error("Nie znaleziono kontenera na przyciski w HTML!");
        return;
    }

    styles.forEach(style => {
        const button = document.createElement('button');
        button.innerText = style.name;
        button.addEventListener('click', () => {
            applyStyle(style);
        });
        container.appendChild(button);
    });
}

applyStyle(currentStyle);

renderStyleSwitcher();