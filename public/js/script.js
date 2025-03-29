document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const produtosLista = document.getElementById('produtos-lista');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const produtoForm = document.getElementById('produto-form');
  const deleteModal = document.getElementById('delete-modal');
  const confirmDelete = document.getElementById('confirm-delete');
  const cancelDelete = document.getElementById('cancel-delete');
  const cancelarBtn = document.getElementById('cancelar-btn');
  const loadingEl = document.getElementById('loading');
  const noProductsEl = document.getElementById('no-products');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  
  let produtosData = [];
  let produtoParaDeletar = null;
  let editandoProduto = false;
  
  // API URLs
  const API_URL = '/api/produtos';
  
  // ===== Event Listeners =====
  
  // Alternar entre as abas
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Remover classe active de todas as abas
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Adicionar classe active para a aba clicada
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
      
      // Resetar formulário ao trocar para a aba de adicionar produto
      if (tabId === 'adicionar-produto' && !editandoProduto) {
        produtoForm.reset();
        document.getElementById('produto-id').value = '';
      }
    });
  });
  
  // Pesquisar produtos
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    filtrarProdutos(query);
  });
  
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim().toLowerCase();
      filtrarProdutos(query);
    }
  });
  
  // Enviar formulário para adicionar/editar produto
  produtoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const produtoId = document.getElementById('produto-id').value;
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const categoria = document.getElementById('categoria').value;
    const fornecedor = document.getElementById('fornecedor').value;
    
    const produtoData = {
      nome,
      descricao,
      preco,
      quantidade,
      categoria,
      fornecedor
    };
    
    try {
      let response;
      
      if (produtoId) {
        // Atualizar produto existente
        response = await fetch(`${API_URL}/${produtoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(produtoData)
        });
      } else {
        // Adicionar novo produto
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(produtoData)
        });
      }
      
      if (!response.ok) {
        throw new Error('Erro ao salvar o produto');
      }
      
      const result = await response.json();
      
      // Mostrar notificação de sucesso
      mostrarToast(produtoId ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!', 'success');
      
      // Resetar formulário e voltar para a aba de lista
      produtoForm.reset();
      document.getElementById('produto-id').value = '';
      editandoProduto = false;
      
      // Mudar para a aba de lista de produtos
      tabBtns[0].click();
      
      // Recarregar a lista de produtos
      carregarProdutos();
      
    } catch (error) {
      console.error('Erro:', error);
      mostrarToast('Erro ao salvar o produto. Tente novamente.', 'error');
    }
  });
  
  // Cancelar edição/adição
  cancelarBtn.addEventListener('click', () => {
    produtoForm.reset();
    document.getElementById('produto-id').value = '';
    editandoProduto = false;
    tabBtns[0].click();
  });
  
  // Modal de confirmação para exclusão
  confirmDelete.addEventListener('click', async () => {
    if (produtoParaDeletar) {
      try {
        const response = await fetch(`${API_URL}/${produtoParaDeletar}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Erro ao excluir o produto');
        }
        
        mostrarToast('Produto excluído com sucesso!', 'success');
        fecharModal();
        carregarProdutos();
        
      } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao excluir o produto. Tente novamente.', 'error');
      }
    }
  });
  
  cancelDelete.addEventListener('click', fecharModal);
  
  // Fechar modal ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      fecharModal();
    }
  });
  
  // ===== Funções =====
  
  // Carregar todos os produtos
  async function carregarProdutos() {
    mostrarLoading(true);
    
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      
      produtosData = await response.json();
      renderizarProdutos(produtosData);
      
    } catch (error) {
      console.error('Erro:', error);
      mostrarToast('Erro ao carregar produtos. Tente novamente.', 'error');
      produtosLista.innerHTML = '';
      noProductsEl.classList.remove('hidden');
    } finally {
      mostrarLoading(false);
    }
  }
  
  // Renderizar lista de produtos
  function renderizarProdutos(produtos) {
    produtosLista.innerHTML = '';
    
    if (produtos.length === 0) {
      noProductsEl.classList.remove('hidden');
    } else {
      noProductsEl.classList.add('hidden');
      
      produtos.forEach(produto => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
          <td>${produto.nome}</td>
          <td>${produto.categoria || '-'}</td>
          <td>R$ ${produto.preco.toFixed(2)}</td>
          <td>${produto.quantidade}</td>
          <td>
            <button class="action-btn edit-btn" data-id="${produto._id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-id="${produto._id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;
        
        produtosLista.appendChild(tr);
      });
      
      // Adicionar listeners para edição e exclusão
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editarProduto(btn.getAttribute('data-id')));
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => abrirModalDeletar(btn.getAttribute('data-id')));
      });
    }
  }
  
  // Filtrar produtos
  function filtrarProdutos(query) {
    if (!query) {
      renderizarProdutos(produtosData);
      return;
    }
    
    const produtosFiltrados = produtosData.filter(produto => 
      produto.nome.toLowerCase().includes(query) ||
      (produto.categoria && produto.categoria.toLowerCase().includes(query)) ||
      (produto.fornecedor && produto.fornecedor.toLowerCase().includes(query)) ||
      (produto.descricao && produto.descricao.toLowerCase().includes(query))
    );
    
    renderizarProdutos(produtosFiltrados);
  }
  
  // Editar produto
  async function editarProduto(id) {
    try {
      mostrarLoading(true);
      
      const response = await fetch(`${API_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes do produto');
      }
      
      const produto = await response.json();
      
      // Preencher o formulário com os dados do produto
      document.getElementById('produto-id').value = produto._id;
      document.getElementById('nome').value = produto.nome;
      document.getElementById('descricao').value = produto.descricao || '';
      document.getElementById('preco').value = produto.preco;
      document.getElementById('quantidade').value = produto.quantidade;
      document.getElementById('categoria').value = produto.categoria || '';
      document.getElementById('fornecedor').value = produto.fornecedor || '';
      
      // Mudar para a aba de adição/edição
      editandoProduto = true;
      tabBtns[1].click();
      
    } catch (error) {
      console.error('Erro:', error);
      mostrarToast('Erro ao carregar detalhes do produto', 'error');
    } finally {
      mostrarLoading(false);
    }
  }
  
  // Abrir modal de confirmação para deletar
  function abrirModalDeletar(id) {
    produtoParaDeletar = id;
    deleteModal.classList.add('active');
  }
  
  // Fechar modal
  function fecharModal() {
    deleteModal.classList.remove('active');
    produtoParaDeletar = null;
  }
  
  // Mostrar/esconder loader
  function mostrarLoading(show) {
    if (show) {
      loadingEl.classList.remove('hidden');
    } else {
      loadingEl.classList.add('hidden');
    }
  }
  
  // Mostrar notificação toast
  function mostrarToast(mensagem, tipo) {
    toastMessage.textContent = mensagem;
    
    if (tipo === 'success') {
      toast.className = 'toast toast-success show';
      toastIcon.className = 'fas fa-check-circle';
    } else {
      toast.className = 'toast toast-error show';
      toastIcon.className = 'fas fa-exclamation-circle';
    }
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // Inicializar
  carregarProdutos();
}); 