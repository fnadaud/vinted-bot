const container = document.getElementById('results-container');
const status = document.getElementById('status');
const refreshBtn = document.getElementById('refreshBtn');

function displayItems(groupedData) {
    container.innerHTML = '';
    
    if (!groupedData || groupedData.length === 0 || !groupedData[0].search_text) {
        container.innerHTML = `<div class="empty-state">Aucune donnée formatée. Cliquez sur Refresh.</div>`;
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
            
            group.items.forEach(item => {
                const card = `
                    <a href="${item.url}" target="_blank" class="card">
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
        }
        
        container.appendChild(groupSection);
    });
}

async function loadInitialData() {
    try {
        const res = await fetch('/api/items');
        const items = await res.json();
        displayItems(items);
    } catch (error) {
        container.innerHTML = `<div class="empty-state">Impossible de charger les données.</div>`;
    }
}

async function refreshData() {
    refreshBtn.disabled = true;
    status.classList.add('visible');
    container.style.opacity = '0.5';
    
    try {
        const res = await fetch('/api/refresh', { method: 'POST' });
        const newItems = await res.json();
        displayItems(newItems);
    } catch (err) {
        alert("Erreur");
    } finally {
        refreshBtn.disabled = false;
        status.classList.remove('visible');
        container.style.opacity = '1';
    }
}

loadInitialData();