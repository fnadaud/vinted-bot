const container = document.getElementById('results-container');
const status = document.getElementById('status');

function displayItems(groupedData) {
    container.innerHTML = '';
    
    if (!groupedData || groupedData.length === 0 || !groupedData[0].search_text) {
        container.innerHTML = '<div class="empty-state">Aucune donnée formatée.</div>';
        return;
    }
    
    groupedData.forEach(group => {
        const groupSection = document.createElement('div');
        groupSection.className = 'group-section';
        
        const groupTitle = document.createElement('h2');
        groupTitle.className = 'group-title';
        groupTitle.textContent = `${group.search_text} (${group.items.length})`;
        groupSection.appendChild(groupTitle);
        
        if (group.items.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-state';
            emptyMsg.textContent = "Aucune annonce pertinente trouvée pour cette recherche.";
            groupSection.appendChild(emptyMsg);
        } else {
            const grid = document.createElement('div');
            grid.className = 'grid';
            
            group.items.forEach((item, index) => {
                const isHidden = index >= 10 ? ' hidden-item' : '';
                const card = `
                    <a href="${item.url}" target="_blank" class="card${isHidden}">
                        <div class="card-image-wrapper">
                            <img src="${item.image}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="card-content">
                            <div class="price">${item.price}</div>
                            <div class="title" title="${item.title}">${item.title}</div>
                        </div>
                    </a>
                `;
                grid.innerHTML += card;
            });
            
            groupSection.appendChild(grid);

            if (group.items.length > 10) {
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'toggle-button';
                toggleBtn.textContent = 'Voir plus';
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = groupSection.classList.toggle('expanded');
                    toggleBtn.textContent = isExpanded ? 'Voir moins' : 'Voir plus';
                });
                groupSection.appendChild(toggleBtn);
            }
        }
        
        container.appendChild(groupSection);
    });
}

async function refreshData() {
    status.classList.add('visible');
    container.style.opacity = '0.5';
    
    try {
        const res = await fetch('/api/refresh', { method: 'POST' });
        const newItems = await res.json();
        displayItems(newItems);
    } catch (err) {
        alert("Erreur lors de la mise à jour");
    } finally {
        status.classList.remove('visible');
        container.style.opacity = '1';
    }
}

async function loadData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        const timestampElement = document.getElementById('last-updated');
        
        if (data.timestamp) {
            const date = new Date(data.timestamp);
            const timeString = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateString = date.toLocaleDateString('fr-FR');
            timestampElement.innerText = `Dernière mise à jour automatique : ${dateString} à ${timeString}`;
        } else {
            timestampElement.innerText = 'Aucune donnée en mémoire.';
        }

        displayItems(data.groups);
    } catch (error) {
        const timestampElement = document.getElementById('last-updated');
        if (timestampElement) {
            timestampElement.innerText = 'Erreur lors du chargement des données.';
        }
    }
}

loadData();