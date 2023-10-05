// Attendre 2 secondes (2000 millisecondes) avant d'exécuter le code
const bouton_lancer_recherche = document.querySelector('#date_button');
bouton_lancer_recherche.addEventListener('click', function () {
    run()
})

function run() {
    setTimeout(function () {
        const h3Elements = document.querySelectorAll('h3.ui-accordion-header');

        const span_counter = document.createElement('span');

        // Chargez l'état actuel des checkboxes depuis localStorage
        const checkboxState = JSON.parse(localStorage.getItem('checkboxState')) || {};
        const commentState = JSON.parse(localStorage.getItem('commentState')) || {};

        let count_checked = 0;
        let count_not_checked = 0;

        // Parcourez les balises <h3> et appliquez une action à chacune d'elles
        h3Elements.forEach((element) => {
            // Récupérez le texte à l'intérieur de la balise <h3>
            const texteDansH3 = element.textContent;

            // Utilisez une expression régulière pour extraire l'ID
            const idMatch = texteDansH3.match(/ID (\d+)/);

            if (idMatch) {
                // L'ID a été trouvé dans le texte, récupérez-le
                const id = idMatch[1];

                // Créez une checkbox pour chaque balise <h3> avec l'ID comme id
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `checkbox-${id}`;

                // Chargez l'état de la checkbox depuis localStorage
                if (checkboxState[id]) {
                    checkbox.checked = true;
                    count_checked++
                } else {
                    checkbox.checked = false;
                }
                count_not_checked++

                const textarea = document.createElement('textarea'); // Ajout du textarea
                textarea.id = `textarea-${id}`;
                textarea.placeholder = 'Ajouter un commentaire...';

                // Charger l'état du commentaire depuis localStorage
                textarea.value = commentState[id] || '';

                // Créez une div pour contenir la checkbox et le textarea
                const containerDiv = document.createElement('div');

                element.appendChild(checkbox);
                containerDiv.appendChild(textarea);

                // Insérez la div avant la balise h3
                element.insertAdjacentElement('beforebegin', containerDiv);

                checkbox.addEventListener('click', function (e) {
                    // Empêchez la propagation de l'événement de clic de la checkbox
                    e.stopPropagation();

                    // Mettez à jour l'état de la checkbox
                    checkboxState[id] = checkbox.checked;

                    // Sauvegardez l'état mis à jour des checkboxes dans localStorage
                    localStorage.setItem('checkboxState', JSON.stringify(checkboxState));

                    if (this.checked) {
                        console.log(`checkbox-${id} checked`);
                    } else {
                        console.log(`checkbox-${id} not checked`);
                    }
                });

                textarea.addEventListener('click', function (e) {
                    // Empêchez la propagation de l'événement de clic de la checkbox
                    e.stopPropagation();
                });

                textarea.addEventListener('input', function () {
                    commentState[id] = textarea.value; // Enregistrer le commentaire
                    localStorage.setItem('commentState', JSON.stringify(commentState));
                });
            }
        });

        let contacte = "contacté";
        if (count_checked > 1) {
            contacte = "contactés"
        }
        span_counter.innerHTML = `dont ${count_checked} ${contacte}`;

        document.querySelector('#affichage_presta > div').appendChild(span_counter)
    }, 2000);
}

run()