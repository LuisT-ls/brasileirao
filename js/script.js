document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle')
  const body = document.body
  const tabelaFiltros = document.getElementById('tabela-filtros')
  const tabelaBody = document.getElementById('tabela-body')
  const dataFolderPath = 'data'

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme')
    updateThemeIcon()
  })

  const updateThemeIcon = () => {
    if (body.classList.contains('dark-theme')) {
      themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>'
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>'
    }
  }

  updateThemeIcon()

  // Fetch JSON data
  const fetchData = async filename => {
    const response = await fetch(`${dataFolderPath}/${filename}`)
    return response.json()
  }

  const renderTabela = (teams, filter = 'todos') => {
    tabelaBody.innerHTML = ''
    let filteredTeams
    if (filter === 'todos') {
      filteredTeams = teams
    } else if (filter === 'g4') {
      filteredTeams = teams.filter(team => team.position <= 4)
    } else if (filter === 'z4') {
      filteredTeams = teams.filter(team => team.position >= 17)
    }

    filteredTeams.forEach(team => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${team.position}</td>
        <td>${team.team}</td>
        <td>${team.points}</td>
        <td>${team.games}</td>
        <td>${team.wins}</td>
        <td>${team.draws}</td>
        <td>${team.losses}</td>
        <td>${team.goalDifference}</td>
      `
      tabelaBody.appendChild(row)
    })
  }

  tabelaFiltros.addEventListener('click', e => {
    if (e.target.classList.contains('filtro-btn')) {
      const filter = e.target.dataset.filter
      fetchData('tabela.json').then(teams => {
        renderTabela(teams, filter)
      })
    }
  })

  // Initial Load
  fetchData('tabela.json').then(teams => {
    renderTabela(teams)
  })

  // Modal Handling
  const loginButton = document.getElementById('login-button')
  const registerButton = document.getElementById('register-button')
  const loginModal = document.getElementById('login-modal')
  const registerModal = document.getElementById('register-modal')

  const closeModal = modal => {
    modal.style.display = 'none'
  }

  const openModal = modal => {
    modal.style.display = 'block'
  }

  loginButton.addEventListener('click', () => {
    openModal(loginModal)
  })

  registerButton.addEventListener('click', () => {
    openModal(registerModal)
  })

  window.addEventListener('click', e => {
    if (e.target === loginModal) {
      closeModal(loginModal)
    } else if (e.target === registerModal) {
      closeModal(registerModal)
    }
  })

  // Form Submission Handling (dummy)
  const loginForm = document.getElementById('login-form')
  const registerForm = document.getElementById('register-form')

  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    closeModal(loginModal)
    alert('Login successful!')
  })

  registerForm.addEventListener('submit', e => {
    e.preventDefault()
    closeModal(registerModal)
    alert('Registration successful!')
  })

  // Additional Sections - Example for 'jogos'
  const jogosContainer = document.getElementById('lista-jogos')

  const renderJogos = jogos => {
    jogosContainer.innerHTML = ''
    jogos.forEach(jogo => {
      const jogoDiv = document.createElement('div')
      jogoDiv.className = 'jogo'
      const formattedDate = new Date(jogo.dateTime).toLocaleString('pt-BR')
      jogoDiv.innerHTML = `
        <span>${jogo.homeTeam} vs ${jogo.awayTeam}</span>
        <time datetime="${jogo.dateTime}">${formattedDate}</time>
      `
      jogosContainer.appendChild(jogoDiv)
    })
  }

  fetchData('jogos.json').then(jogos => {
    renderJogos(jogos)
  })

  // Example for 'estatisticas'
  const artilheirosContainer = document.getElementById('lista-artilheiros')
  const vitoriasContainer = document.getElementById('lista-vitorias')

  const renderEstatisticas = estatisticas => {
    artilheirosContainer.innerHTML = ''
    vitoriasContainer.innerHTML = ''
    estatisticas.artilheiros.forEach(artilheiro => {
      const li = document.createElement('li')
      li.textContent = `${artilheiro.name} - ${artilheiro.goals} gols`
      artilheirosContainer.appendChild(li)
    })
    estatisticas.vitorias.forEach(time => {
      const li = document.createElement('li')
      li.textContent = `${time.name} - ${time.wins} vitórias`
      vitoriasContainer.appendChild(li)
    })
  }

  fetchData('estatisticas.json').then(estatisticas => {
    renderEstatisticas(estatisticas)
  })
})
