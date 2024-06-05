class CalorieTracker {
	constructor() {
		this._calorieLimit = Storage.getCalorieLimit();
		this._totalCalories = Storage.getTotalCalories();
		this._meals = Storage.getMeals();
		this._workouts = Storage.getWorkouts();
		this._displayCalorieLimit();
		this._render();
	}

	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		Storage.setTotalCalories(this._totalCalories);
		Storage.saveMeal(meal);
		this._displayNewMeal(meal);
		this._render();
	}

	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		Storage.setTotalCalories(this._totalCalories);
		Storage.saveWorkout(workout);
		this._displayNewWorkout(workout);
		this._render();
	}

	removeMeal(item) {
		const parentElement = item.closest(".card");

		if (parentElement) {
			const id = parentElement.getAttribute("data-id");

			Storage.removeMeal(id);

			const mealToRemove = this._meals.find((meal) => meal.id === id);

			if (mealToRemove) {
				this._totalCalories -= mealToRemove.calories;

				Storage.setTotalCalories(this._totalCalories);

				this._meals = this._meals.filter((meal) => meal.id !== id);

				parentElement.remove();
			}
		}
		this._render();
	}

	removeWorkout(item) {
		const parentElement = item.closest(".card");

		if (parentElement) {
			const id = parentElement.getAttribute("data-id");

			Storage.removeWorkout(id);

			const mealToRemove = this._workouts.find(
				(workouts) => workouts.id === id
			);

			if (mealToRemove) {
				this._totalCalories += mealToRemove.calories;
				Storage.setTotalCalories(this._totalCalories);

				this._workouts = this._workouts.filter(
					(workouts) => workouts.id !== id
				);

				parentElement.remove();
			}
		}
		this._render();
	}

	resetDay() {
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];

		const mealItemsCont = document.getElementById("meal-items");

		const mealItemsKids = mealItemsCont.childNodes;

		mealItemsKids.forEach((item) => {
			item.remove();
		});

		const workoutItemsCont = document.getElementById("workout-items");

		const workoutItemsKids = workoutItemsCont.childNodes;

		workoutItemsKids.forEach((item) => {
			item.remove();
		});

		Storage.clearLocal();

		this._render();
	}

	setLimit(userValue) {
		this._calorieLimit = userValue;
		Storage.setCalorieLimit(userValue);
		this._render();
	}

	loadItems() {
		this._meals.forEach((meal) => {
			this._displayNewMeal(meal);
		});

		this._workouts.forEach((workout) => {
			this._displayNewWorkout(workout);
		});
	}

	_progressBar() {
		const bar = document.getElementById("calorie-progress");

		if (this._meals.length <= 0) {
			return;
		}

		const consumedCalories = this._meals.reduce(
			(total, meal) => total + meal.calories,
			0
		);

		const caloriesRemainingEle = document.getElementById("calories-remaining");

		const parentEle = caloriesRemainingEle.closest(".card-body");

		if (consumedCalories > this._calorieLimit) {
			parentEle.classList.add("bg-danger");
			bar.classList.add("bg-danger");
			parentEle.classList.remove("bg-light");
			bar.classList.remove("bg-light");
		} else {
			parentEle.classList.add("bg-light");
			bar.classList.add("bg-light");
			parentEle.classList.remove("bg-danger");
			bar.classList.remove("bg-danger");
		}
		bar.style.width = `${(consumedCalories / this._calorieLimit) * 100}%`;
	}

	_displayCalorieTotal() {
		const calorieTotalEle = document.getElementById("calories-total");
		calorieTotalEle.innerText = this._totalCalories;
	}

	_displayCalorieLimit() {
		const calorieLimitEle = document.getElementById("calories-limit");
		calorieLimitEle.innerText = this._calorieLimit;
	}

	_displayCalorieConsumed() {
		const calorieConsumedEle = document.getElementById("calories-consumed");
		const consumedCalories = this._meals.reduce(
			(total, meal) => total + meal.calories,
			0
		);
		calorieConsumedEle.innerHTML = consumedCalories;
	}

	_displayCalorieBurned() {
		const calorieBurnedEle = document.getElementById("calories-burned");
		const burnedCalories = this._workouts.reduce(
			(total, workout) => total + workout.calories,
			0
		);
		calorieBurnedEle.innerText = burnedCalories;
	}

	_displayCaloriesRemaining() {
		const calorieRemainingEle = document.getElementById("calories-remaining");
		const calorieRemaining = this._meals.reduce(
			(total, meals) => total + meals.calories,
			0
		);

		calorieRemainingEle.innerText = this._calorieLimit - calorieRemaining;
	}

	_displayNewMeal(meal) {
		const mealContainerEle = document.getElementById("meal-items");

		const div = document.createElement("div");
		div.classList.add("card", "my-2");

		div.setAttribute("data-id", meal.id);

		div.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1 item-name">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
    `;

		mealContainerEle.appendChild(div);
	}

	_displayNewWorkout(workout) {
		const workoutContainerEle = document.getElementById("workout-items");

		const div = document.createElement("div");
		div.classList.add("card", "my-2");

		div.setAttribute("data-id", workout.id);
		div.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
    `;

		workoutContainerEle.appendChild(div);
	}
	_render() {
		this._displayCalorieConsumed();
		this._displayCalorieTotal();
		this._displayCalorieBurned();
		this._displayCaloriesRemaining();
		this._displayCalorieLimit();
		this._progressBar();
	}
}

class FitnessAndDiet {
	constructor(name, calories) {
		this.id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		this.name = name;
		this.calories = Number(calories);
	}
}

class Storage {
	static getCalorieLimit(defaultLimit = 2000) {
		let calorieLimit;
		if (localStorage.getItem("calorieLimit") === null) {
			calorieLimit = defaultLimit;
		} else {
			calorieLimit = +localStorage.getItem("calorieLimit");
		}

		return calorieLimit;
	}

	static setCalorieLimit(calorieLimit) {
		localStorage.setItem("calorieLimit", calorieLimit);
	}

	static getTotalCalories(defaultLimit = 0) {
		let totalCalorie;

		if (localStorage.getItem("totalCalorie") === null) {
			totalCalorie = defaultLimit;
		} else {
			totalCalorie = +localStorage.getItem("totalCalorie");
		}
		return totalCalorie;
	}

	static setTotalCalories(calories) {
		localStorage.setItem("totalCalorie", calories);
	}
	static getMeals() {
		let meals;

		if (localStorage.getItem("meals") === null) {
			meals = [];
		} else {
			meals = JSON.parse(localStorage.getItem("meals"));
		}

		return meals;
	}
	static saveMeal(meal) {
		let meals = Storage.getMeals();
		meals.push(meal);
		localStorage.setItem("meals", JSON.stringify(meals));
	}

	static getWorkouts() {
		let workouts;

		if (localStorage.getItem("workouts") === null) {
			workouts = [];
		} else {
			workouts = JSON.parse(localStorage.getItem("workouts"));
		}

		return workouts;
	}
	static saveWorkout(workout) {
		let workouts = Storage.getWorkouts();
		workouts.push(workout);
		localStorage.setItem("workouts", JSON.stringify(workouts));
	}

	static removeMeal(id) {
		const meals = Storage.getMeals();

		meals.forEach((meal, index) => {
			if (meal.id === id) {
				meals.splice(index, 1);
			}
		});

		localStorage.setItem("meals", JSON.stringify(meals));
	}

	static removeWorkout(id) {
		const workouts = Storage.getWorkouts();

		workouts.forEach((workout, index) => {
			if (workout.id === id) {
				workouts.splice(index, 1);
			}
		});

		localStorage.setItem("workouts", JSON.stringify(workouts));
	}

	static clearLocal() {
		localStorage.clear();
	}
}

class App {
	constructor() {
		this._tracker = new CalorieTracker();
		document
			.getElementById("meal-form")
			.addEventListener("submit", this._newMeal.bind(this));
		document
			.getElementById("workout-form")
			.addEventListener("submit", this._newWorkout.bind(this));

		// DELETE BUTTONS LISTENER
		document
			.getElementById("meal-items")
			.addEventListener("click", this._removeMeal.bind(this));
		// DELETE BUTTONS LISTENER
		document
			.getElementById("workout-items")
			.addEventListener("click", this._removeWorkout.bind(this));

		document
			.getElementById("reset")
			.addEventListener("click", this._resetDay.bind(this));

		document
			.getElementById("limit-form")
			.addEventListener("submit", this._setLimit.bind(this));

		document
			.getElementById("filter-meals")
			.addEventListener("input", this._filterItems.bind(this, "meal"));
		document
			.getElementById("filter-workouts")
			.addEventListener("input", this._filterItems.bind(this, "workout"));

		this._tracker.loadItems();
	}

	_newMeal(event) {
		event.preventDefault();

		const mealName = document.getElementById("meal-name");
		const mealCalories = document.getElementById("meal-calories");

		if (mealName.value === "" && mealCalories.value === "") {
			alert("Please fill out both meal name and calories of meal");
			return;
		} else if (mealName.value === "") {
			alert("Please fill out meal name");
			return;
		} else if (mealCalories.value === "") {
			alert("Please fill out meal calories");
		}

		const meal = new FitnessAndDiet(mealName.value, mealCalories.value);

		this._tracker.addMeal(meal);

		mealName.value = "";
		mealCalories.value = "";
	}

	_newWorkout(event) {
		event.preventDefault();

		const workoutName = document.getElementById("workout-name");
		const workoutCalories = document.getElementById("workout-calories");

		if (workoutName.value === "" && workoutCalories.value === "") {
			alert("Please fill out both meal name and calories of meal");
			return;
		} else if (workoutName.value === "") {
			alert("Please fill out meal name");
			return;
		} else if (workoutCalories.value === "") {
			alert("Please fill out meal calories");
		}

		const workout = new FitnessAndDiet(
			workoutName.value,
			workoutCalories.value
		);

		this._tracker.addWorkout(workout);

		workoutName.value = "";
		workoutCalories.value = "";
	}

	_removeMeal(event) {
		if (
			event.target.classList.contains("delete") ||
			event.target.classList.contains("fa-solid")
		) {
			this._tracker.removeMeal(event.target);
		}
	}

	_removeWorkout(event) {
		if (
			event.target.classList.contains("delete") ||
			event.target.classList.contains("fa-solid")
		) {
			this._tracker.removeWorkout(event.target);
		}
	}

	_resetDay() {
		this._tracker.resetDay();
	}

	_setLimit(event) {
		event.preventDefault();

		const userLimit = document.getElementById("limit");

		if (userLimit.value === "") {
			alert("Please fill out field for Calorie Limit");
		} else {
			this._tracker.setLimit(userLimit.value);
			userLimit.value = "";
		}

		const modalEle = document.getElementById("limit-modal");
		const modal = bootstrap.Modal.getInstance(modalEle);
		modal.hide();
	}

	_filterItems(type, e) {
		const text = e.target.value.toLowerCase();

		document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
			const name = item.firstElementChild.firstElementChild.textContent;

			if (name.toLowerCase().indexOf(text) !== -1) {
				item.style.display = "block";
			} else {
				item.style.display = "none";
			}
		});
	}
}

function init() {
	new App();
}

init();
