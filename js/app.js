(function (window) {

	// Your starting point. Enjoy the ride!

	Vue.directive("add-focus",{
		inserted: function(el){
			el.focus()
		}
	})

	Vue.directive("item-focus",{
		update: function(el,binding){
			if(binding.value){
				el.focus()
			}
		}
	})


	var todos = [
		{
			id: 1,
			title: "吃饭",
			done: true
		},
		{
			id: 2,
			title: "睡觉",
			done: false
		},
		{
			id: 3,
			title: "打豆豆",
			done: true
		}
	]


	if(!localStorage.getItem("todos")){
		setLocalStorage(todos)
	}

	window.app = new Vue({

		el: ".todoapp",

		data: {
			todos: JSON.parse(localStorage.getItem("todos")||"[]"),
			editing: null,
			currentHash: ""
		},

		computed: {
			selectAll: {
				get(){
					return this.todos.every(item=>item.done===true)
				},
				set(){
					var checked = !this.selectAll
					this.todos.forEach(item=>item.done=checked)
				}
			},
			left: function(){
				return this.todos.filter(item=>!item.done).length
			},

			classfiedTodos: {
				get(){
					switch (this.currentHash){
						case "active":
						return this.todos.filter(item=>item.done===false)
						break
						case "completed":
						return this.todos.filter(item=>item.done===true)
						break
						default:
						return this.todos
						break
					}
				}
			}
		},

		watch: {
			todos: {
				handler:function(value){
					setLocalStorage(value)
				},
				deep: true
			}
		},



		methods: {
			deleteItem(index){
				this.todos.splice(index,1)
			},
			addItem(e){
				var target = e.target

				if(!target.value){
					return false
				}

				var todos = this.todos
				todos.push({
					id: todos.length?todos[todos.length-1].id+1:1,
					title: target.value,
					done: false
				})
				target.value = ""
			},
			clearCompleted(){
				this.todos = this.todos.filter(item=>item.done===false)
			},

			editItem(item){
				this.editing = item
			},

			setEditingInner(item,index,e){
				var target = e.target
				if(!target.value){
					this.todos.splice(index,1)
					return false
				}
				item.title=target.value
				// console.log(item,index)
				this.todos[index].title = target.value
				target.value = ""
				this.editing = null 
			},

			escToQuitEditing(){
				this.editing = null
			}
		}
	}) 



	
	window.onhashchange = getHash
	function getHash (){
		app.currentHash = location.hash.substr(2)
		// console.log(location.hash)

	}
	

	function setLocalStorage (value){
		localStorage.setItem("todos",JSON.stringify(value))
	}

})(window);
