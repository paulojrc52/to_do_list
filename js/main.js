 const Main = {

    // Array que guarda os itens do local storage
    tasks: [],


    // Responsável por iniciar a aplicação
    init: function() { 
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
    },



    // Responsável por selecionar os elementos
    cacheSelectors: function() {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
        this.$removeAllButton = document.querySelector('#removeAll')
    },
    


    // Responsável por conectar os eventos
    bindEvents: function() {
        const self = this

        // Concluir tarefa
        this.$checkButtons.forEach(function(button){
            button.onclick = self.Events.checkButton_click.bind(self)
        })

        // Adicionar tarefa
        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)
        
        // Excluir tarefa
        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)
        })

        // Excluir todas
        this.$removeAllButton.onclick = self.Events.removeAll_click.bind(this)

        
    },


    // Eventos
    Events: {

        // Tarefa concluída
        checkButton_click: function(evento) {

            const value = evento.target.dataset['checktask']
            let tasks = this.tasks

            const doneArray = this.tasks.filter(task => task.task == value)
            
            let doneObj = doneArray[0]
            
            tasks.forEach(task => {   
                if(task == doneObj){
                    task.done = true 
                }  
            })
            
            
            localStorage.setItem('tasks', JSON.stringify(tasks))

            if(doneObj.done){
                const li = evento.target.parentElement

                const isDone = li.classList.contains('done')
                if (!isDone) {
                    return li.classList.add('done')
                } 

                li.classList.remove('done')
                tasks.forEach(task => {
                    if(task == doneObj){
                        task.done = false 
                        localStorage.setItem('tasks', JSON.stringify(tasks))
                        
                    }
                })

                this.getStoraged()
            }
  
        },

        // Adicionar Tarefa - concluído
        inputTask_keypress: function(evento){
            const key = evento.key
            const value = evento.target.value
            let obj 
            
            if (key === 'Enter') {

                evento.target.value = ''
                
                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                if(!savedTasksObj) {
                    obj = [
                        {task: value, done: false}
                    ]
                } else {
                    obj = [
                        {task: value, done: false},
                        ...savedTasksObj
                   ]
                }
                this.$list.innerHTML += this.getTaskHtml(obj)
                localStorage.setItem('tasks', JSON.stringify(obj))
                this.getStoraged()
            }
            
        },

        // Excluir tarefa - concluído
        removeButton_click : function(evento){
            
            const li = evento.target.parentElement
            const value = evento.target.dataset['task']
            
            
            const newTasksStates = this.tasks.filter(task => task.task !== value)
            
           
            
            localStorage.setItem('tasks', JSON.stringify(newTasksStates))
            this.getStoraged()
            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)
           
        },

        // Excluir todas as tarefas / finalizado
        removeAll_click: function(){
            
            this.tasks = []

            localStorage.setItem('tasks', (JSON.stringify(this.tasks)))
            
            this.getStoraged()
        }
        
        
    },
    
    // Atribuindo nosso objeto JSON do local storage ao nosso array "tasks" e transformando em objeto JavaScript - concluído
    getStoraged: function(){
        const tasks = localStorage.getItem('tasks') 

        this.tasks = JSON.parse(tasks)

        this.buildTasks()
        this.cacheSelectors()
        this.bindEvents()
    },


    // Responsável por pegar as tarefas e montar na tela - concluído
    buildTasks: function(){ 
        
        let tasks = this.tasks

        let html = ''

        if(!tasks){
            tasks = [{}]
        } else {
            tasks.forEach(item => {
                html += this.getTaskHtml(item)
            })
        }
       
        this.$list.innerHTML = html
    },

    // Responsável por montar o html - concluído
    getTaskHtml: function(task){
        return `
            <li class="${task.done ? 'done': ''}">
                <div class="check" data-checktask="${task.task}"></div>
                <label class="task">
                    ${task.task}
                </label>
                <button class="remove" data-task="${task.task}"></button>
            </li>
        `
    },


}

Main.init()
