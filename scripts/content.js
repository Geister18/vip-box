// Attendre 2 secondes (2000 millisecondes) avant d'exécuter le code
const bouton_lancer_recherche = document.querySelector('#date_button');
bouton_lancer_recherche.addEventListener('click', function () {
    run();
    addFilter();
})

function run() {
    setTimeout(function () {
        const h3Elements = document.querySelectorAll('h3.ui-accordion-header');

        // Chargez l'état actuel des checkboxes et des commentaires depuis localStorage
        const checkboxState = JSON.parse(localStorage.getItem('checkboxState')) || {};
        const commentState = JSON.parse(localStorage.getItem('commentState')) || {};

        h3Elements.forEach((element) => {
            // Extraire l'ID à partir du texte
            const texteDansH3 = element.textContent;
            const idMatch = texteDansH3.match(/ID (\d+)/);

            if (idMatch) {
                const id = idMatch[1];

                // Identifier la div associée pour extraire les données
                const parentDiv = element.nextElementSibling;
                const leftColumn = parentDiv.querySelector('td:first-child'); // Colonne gauche du tableau
                const email = leftColumn.querySelector('div:nth-of-type(3)').textContent.trim(); // Email
                const prestationDiv = Array.from(leftColumn.querySelectorAll('div')).find(div => div.textContent.includes("Nature de la prestation"));
                const prestation = prestationDiv ? prestationDiv.textContent.split(':')[1].trim() : ''; // Extraire uniquement la valeur après ":"

                // Créer une checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `checkbox-${id}`;
                checkbox.checked = !!checkboxState[id];

                // Créer un textarea
                const textarea = document.createElement('textarea');
                textarea.id = `textarea-${id}`;
                textarea.placeholder = 'Ajouter un commentaire...';
                textarea.value = commentState[id] || '';
                textarea.style.height = '1rem';

                // Créer un div pour l'email
                const emailDiv = document.createElement('div');
                emailDiv.textContent = email;
                emailDiv.style.marginLeft = '1rem';

                // Créer un div pour la nature de la prestation (seulement la valeur)
                const natureDiv = document.createElement('div');
                natureDiv.textContent = prestation;
                natureDiv.style.marginLeft = '1rem';
                natureDiv.style.backgroundColor = '#fff';
                natureDiv.style.padding = '0.5rem';

                // Ajuster les styles du h3 pour contenir les éléments
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'space-between';
                element.style.flexWrap = 'wrap';

                // Ajouter les éléments au h3
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.gap = '1rem';

                wrapper.appendChild(checkbox);
                wrapper.appendChild(document.createElement('span')).textContent = element.textContent.trim();
                wrapper.appendChild(textarea);
                wrapper.appendChild(emailDiv);
                wrapper.appendChild(natureDiv);

                // Nettoyer le contenu actuel du h3 et y injecter les éléments
                element.innerHTML = '';
                element.appendChild(wrapper);

                // Ajouter les événements pour la gestion des états
                checkbox.addEventListener('click', function (e) {
                    e.stopPropagation();
                    checkboxState[id] = checkbox.checked;
                    localStorage.setItem('checkboxState', JSON.stringify(checkboxState));
                });

                textarea.addEventListener('click', (e) => e.stopPropagation());
                textarea.addEventListener('input', function () {
                    commentState[id] = textarea.value;
                    localStorage.setItem('commentState', JSON.stringify(commentState));
                });
            }
        });
    }, 1000);
}

function addFilter() {
    setTimeout(function () {
        const filterDiv = document.createElement('div');
        filterDiv.id = 'filter-container';
        filterDiv.style.marginTop = '1rem';
        filterDiv.style.display = 'flex';
        filterDiv.style.gap = '1rem';
        filterDiv.style.alignItems = 'center';
        filterDiv.style.justifyContent = 'center';

        // Créer les deux checkboxes de filtre
        const checkedFilter = document.createElement('input');
        checkedFilter.type = 'checkbox';
        checkedFilter.id = 'filter-checked';

        const uncheckedFilter = document.createElement('input');
        uncheckedFilter.type = 'checkbox';
        uncheckedFilter.id = 'filter-unchecked';

        // Ajouter des labels pour les checkboxes
        const checkedLabel = document.createElement('label');
        checkedLabel.htmlFor = 'filter-checked';

        const uncheckedLabel = document.createElement('label');
        uncheckedLabel.htmlFor = 'filter-unchecked';

        // Ajouter les éléments au filtre
        filterDiv.appendChild(checkedFilter);
        filterDiv.appendChild(checkedLabel);
        filterDiv.appendChild(uncheckedFilter);
        filterDiv.appendChild(uncheckedLabel);

        // Insérer la div filtre après le premier enfant de la div "affichage_presta"
        const affichagePrestaDiv = document.querySelector('#affichage_presta');
        if (affichagePrestaDiv && affichagePrestaDiv.firstElementChild) {
            affichagePrestaDiv.firstElementChild.insertAdjacentElement('afterend', filterDiv);
        }

        // Fonction pour calculer le nombre de contacts (cochés et non cochés)
        function updateFilterLabels() {
            const h3Elements = document.querySelectorAll('.accordion_presta');

            let checkedCount = 0;
            let uncheckedCount = 0;

            h3Elements.forEach((accordion) => {
                const checkbox = accordion.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    if (checkbox.checked) {
                        checkedCount++;
                    } else {
                        uncheckedCount++;
                    }
                }
            });

            // Mettre à jour les labels
            checkedLabel.textContent = `${checkedCount} contactés`;
            uncheckedLabel.textContent = `${uncheckedCount} non contactés`;
        }

        // Appliquer le filtre et afficher les éléments en fonction de l'état des checkboxes
        function applyFilter() {
            const showChecked = checkedFilter.checked;
            const showUnchecked = uncheckedFilter.checked;

            const accordionDates = document.querySelectorAll('.accordion_presta');
            accordionDates.forEach((accordion) => {
                const hasChecked = accordion.querySelector('input[type="checkbox"]:checked');
                const hasUnchecked = accordion.querySelector('input[type="checkbox"]:not(:checked)');

                // Vérifier si on doit afficher l'accordion_date
                if (
                    (showChecked && hasChecked) ||
                    (showUnchecked && hasUnchecked) ||
                    (!showChecked && !showUnchecked) // Si aucun filtre actif, afficher tout
                ) {
                    accordion.style.display = '';
                } else {
                    accordion.style.display = 'none';
                }
            });
        }

        // Écouter les changements des checkboxes de filtre
        checkedFilter.addEventListener('change', applyFilter);
        uncheckedFilter.addEventListener('change', applyFilter);

        // Initialiser les labels au chargement de la page
        updateFilterLabels();
    }, 1100);
}

// Ajouter les filtres après avoir généré les contenus
run();
addFilter();