document.addEventListener('DOMContentLoaded', () => {
    const apiUrls = [
        'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=1',
        'https://jsonplaceholder.typicode.com/comments',
        'https://dog.ceo/api/breeds/image/random',
        'https://api.thecatapi.com/v1/images/search'
    ];

    async function formatObras(data) {
        const randomId = data.objectIDs[Math.floor(Math.random() * data.objectIDs.length)];
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomId}`);
        const artwork = await response.json();
        
        return `
            <div>
                <h3>${artwork.title || 'Sem título'}</h3>
                <p><strong>Autor:</strong> ${artwork.artistDisplayName || 'Desconhecido'}</p>
                <p><strong>Data:</strong> ${artwork.objectDate || 'Desconhecida'}</p>
                <p><strong>Descrição:</strong> ${artwork.artistDisplayBio || 'Sem descrição'}</p>
                ${artwork.primaryImage ? `<img src="${artwork.primaryImage}" alt="${artwork.title}" style="width:100%; max-width:600px;" />` : ''}
            </div>
        `;
    }

    function formatComentarios(data) {
        return data.slice(0, 1).map(comment => `
            <div>
                <p><strong>Nome:</strong> ${comment.name}</p>
                <p><strong>Email:</strong> ${comment.email}</p>
                <p><strong>Comentário:</strong> ${comment.body}</p>
            </div>
        `).join('');
    }

    function formatCachorros(data) {
        return `
            <div>
                <p><strong>Imagem de um cachorro:</strong></p>
                <img src="${data.message}" alt="Imagem de um cachorro" style="width:100%; max-width:600px;" />
            </div>
        `;
    }

    function formatGatos(data) {
        return `
            <div>
                <p><strong>Imagem de um gato:</strong></p>
                <img src="${data[0].url}" alt="Imagem de um gato" style="width:100%; max-width:600px;" />
            </div>
        `;
    }

    async function updateDiv(id, data, formatFunction) {
        const section = document.getElementById(id);
        const content = await formatFunction(data);
        const button = section.querySelector('button');
        section.innerHTML = `<h2>${section.querySelector('h2').textContent}</h2>
                             ${content}`;
        section.appendChild(button);
    }

    async function fetchData(index) {
        try {
            const response = await fetch(apiUrls[index]);

            if (!response.ok) {
                throw new Error(`Erro na resposta: ${response.status}`);
            }

            const data = await response.json();
            switch (index) {
                case 0:
                    await updateDiv('section1', data, formatObras);
                    break;
                case 1:
                    updateDiv('section2', data, formatComentarios);
                    break;
                case 2:
                    updateDiv('section3', data, formatCachorros);
                    break;
                case 3:
                    updateDiv('section4', data, formatGatos);
                    break;
            }
        } catch (error) {
            console.error('Erro:', error);
            const section = document.getElementById(`section${index + 1}`);
            section.innerHTML = `<h2>${section.querySelector('h2').textContent}</h2>
                                 <p>Erro ao carregar dados.</p>`;
        }
    }

    function addButtons() {
        document.querySelectorAll('.section').forEach((section, index) => {
            const button = document.createElement('button');
            button.textContent = `Gerar novos dados para a seção ${index + 1}`;
            button.addEventListener('click', () => fetchData(index));
            section.appendChild(button);
        });
    }

    fetchData(0);
    fetchData(1);
    fetchData(2);
    fetchData(3);
    addButtons();
});
