//Selene - Busca de livros 
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('form-preferencias');
  const rec = document.getElementById('recomendacoes');
  const placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2MDAnIGhlaWdodD0nOTAwJyB2aWV3Qm94PScwIDAgNjAwIDkwMCc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2ZmZjdmYicvPjxnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDMwMCwzMDApIHNjYWxlKDEuNikgdHJhbnNsYXRlKC02MCwtOTApJyBmaWxsPScjNWExZWE2Jz48cGF0aCBkPSdNMTAgMTEwIEMzMCAzMCwgMTMwIDMwLCAxNTAgMTEwIEMxNzAgMTkwLCAxMzAgMjMwLCA5MCAyMzAgQzUwIDIzMCwgMTAgMTkwLCAxMCAxMTAgWicvPjxjaXJjbGUgY3g9JzYwJyBjeT0nNzAnIHI9JzYnIGZpbGw9JyNmZmYnLz48Y2lyY2xlIGN4PScxMDAnIGN5PSc3MCcgcj0nNicgZmlsbD0nI2ZmZicvPjwvZz48dGV4dCB4PSczMDAnIHk9Jzg2MCcgZm9udC1mYW1pbHk9J051bml0bywgQXJpYWwnIGZvbnQtc2l6ZT0nMjAnIGZpbGw9JyM2YjZiNmInIHRleHQtYW5jaG9yPSdtaWRkbGUnPlNlbGVuZSBwbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=";
  
  // Função para exibir loader
  function showLoader(msg){ 
    rec.innerHTML = '<div class="loader">' + (msg || 'Selene está procurando livros...') + '</div>'; 
  }
  
  // Função para exibir alertas
  function showAlert(msg){ 
    const a = document.createElement('div'); 
    a.className = 'alert'; 
    a.textContent = msg; 
    document.body.appendChild(a); 
    setTimeout(() => a.remove(), 4500); 
  }
  
  // Função para mostrar/ocultar loading no botão
  function toggleButtonLoading(show) {
    const button = document.querySelector('.primary');
    const buttonText = button.querySelector('.button-text');
    const buttonLoading = button.querySelector('.button-loading');
    
    if (show) {
      buttonText.style.display = 'none';
      buttonLoading.style.display = 'inline';
      button.disabled = true;
    } else {
      buttonText.style.display = 'inline';
      buttonLoading.style.display = 'none';
      button.disabled = false;
    }
  }

  if(!form) return;
  
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    
    // Coletar dados do formulário
    const genres = [...document.querySelectorAll('input[name="genero"]:checked')].map(i => i.value);
    const authorsInput = document.getElementById('autores') ? document.getElementById('autores').value : '';
    const authors = authorsInput.split(',').map(s => s.trim()).filter(Boolean);
    const periodo = document.querySelector('input[name="periodo"]:checked').value;
    
    // Determinar anos baseado no período selecionado
    let anosBusca = '';
    switch(periodo) {
      case 'recentes':
        anosBusca = '2023|2024|2025';
        break;
      case 'modernos':
        anosBusca = '2020|2021|2022|2023|2024|2025';
        break;
      default:
        anosBusca = '2020|2021|2022|2023|2024|2025';
    }
    
    // Validação
    if(genres.length === 0){ 
      showAlert('Selecione ao menos um gênero para buscar recomendações.'); 
      return; 
    }
    
    // Exibir loader
    showLoader('Selene está buscando os melhores livros para você...');
    toggleButtonLoading(true);
    
    // Limpar recomendações anteriores
    rec.innerHTML = '';
    const grid = document.createElement('div'); 
    grid.className = 'recs'; 
    rec.appendChild(grid);
    
    try {
      let total = 0;
      const queries = [];
      const livrosUnicos = new Set(); // Para evitar duplicatas
      
      // Construir queries de busca combinando autores e gêneros
      if(authors.length > 0) {
        authors.forEach(author => {
          queries.push({
            term: author,
            type: 'author'
          });
        });
      }
      
      genres.forEach(genre => {
        queries.push({
          term: genre,
          type: 'genre'
        });
      });
      
      // Buscar livros para cada query
      for(const query of queries){
        if(total >= 16) break; // Limite aumentado para mais resultados
        
        let searchTerm = '';
        if (query.type === 'author') {
          searchTerm = `inauthor:"${query.term}"`;
        } else {
          searchTerm = `subject:${query.term}`;
        }
        
        // Adicionar filtro de anos e best-sellers
        const q = encodeURIComponent(`${searchTerm} ${anosBusca} bestseller`);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&printType=books&orderBy=relevance&maxResults=12&langRestrict=pt`;
        
        try {
          const r = await fetch(url);
          const data = await r.json();
          
          if(data && data.items){
            for(const it of data.items){
              if(total >= 16) break;
              
              const info = it.volumeInfo || {};
              const pd = info.publishedDate || '';
              const yearMatch = pd.match(/\d{4}/);
              const year = yearMatch ? parseInt(yearMatch[0]) : 0;
              
              // Filtrar por período selecionado
              if (periodo === 'recentes' && year < 2023) continue;
              if (periodo === 'modernos' && year < 2020) continue;
              
              const title = info.title || 'Título indisponível';
              const bookId = it.id;
              
              // Evitar duplicatas
              if (livrosUnicos.has(bookId)) continue;
              livrosUnicos.add(bookId);
              
              const authorsList = (info.authors || []).join(', ') || 'Autor desconhecido';
              const thumb = (info.imageLinks && (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)) || '';
              const preview = info.previewLink || info.infoLink || '#';
              const description = info.description ? 
                (info.description.length > 150 ? info.description.slice(0, 150) + '...' : info.description) : 
                'Descrição não disponível.';
              
              const rating = info.averageRating || 'Não avaliado';
              const pageCount = info.pageCount ? `${info.pageCount} páginas` : '';
              
              // Criar card do livro
              const card = document.createElement('div'); 
              card.className = 'book-card';
              
              const cover = document.createElement('div'); 
              cover.className = 'book-cover';
              cover.style.backgroundImage = "url('" + (thumb || placeholder) + "')";
              
              const infoDiv = document.createElement('div'); 
              infoDiv.className = 'book-info';
              infoDiv.innerHTML = `
                <h4>${title}</h4>
                <p class="book-authors"><strong>${authorsList}</strong></p>
                <p class="book-meta">
                  ${year ? `<span>${year}</span>` : ''}
                  ${rating !== 'Não avaliado' ? `<span>⭐ ${rating}/5</span>` : ''}
                  ${pageCount ? `<span>${pageCount}</span>` : ''}
                </p>
                <p class="book-description">${description}</p>
                <div class="book-actions">
                  <a href="${preview}" target="_blank" rel="noopener">Ver no Google Books</a>
                </div>
              `;
              
              card.appendChild(cover); 
              card.appendChild(infoDiv); 
              grid.appendChild(card);
              
              total++;
            } 
          }
        } catch (fetchError) {
          console.error(`Erro na busca por ${query.term}:`, fetchError);
        }
      }
      
      // Mensagens baseadas nos resultados
      if (total === 0) {
        grid.innerHTML = `
          <div class="no-results">
            <h3>Nenhum livro encontrado</h3>
            <p>Tente ajustar seus filtros ou selecionar mais gêneros. Selene pode estar com dificuldade em encontrar livros recentes para suas preferências específicas.</p>
            <button onclick="location.reload()" class="primary" style="margin-top: 12px;">Tentar Novamente</button>
          </div>
        `;
      } else {
        // Adicionar cabeçalho com resultados
        const resultsHeader = document.createElement('div');
        resultsHeader.className = 'results-header';
        resultsHeader.innerHTML = `
          <h3>🎉 Selene encontrou ${total} livros para você!</h3>
          <p>Baseado nas suas preferências de ${genres.join(', ')}${authors.length > 0 ? ` e autores como ${authors.slice(0, 2).join(', ')}` : ''}</p>
        `;
        grid.insertBefore(resultsHeader, grid.firstChild);
      }
      
    } catch(err) { 
      console.error('Erro geral:', err); 
      grid.innerHTML = `
        <div class="error-message">
          <h3>Ops! Algo deu errado</h3>
          <p>Erro ao buscar no Google Books. Verifique sua conexão ou tente novamente mais tarde.</p>
          <button onclick="location.reload()" class="primary" style="margin-top: 12px;">Tentar Novamente</button>
        </div>
      `;
    } finally {
      toggleButtonLoading(false);
    }
  });
});