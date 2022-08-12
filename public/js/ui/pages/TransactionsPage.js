/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error(
        `Класс TransactionsPage!!! Элемент(ы) (${element}) отсутствует(ют)!`
      );
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.querySelector(".remove-account");
    removeAccount.addEventListener("click", (event) => {
      event.preventDefault();
      this.removeAccount();
    });
    this.element.addEventListener("click", (event) => {
      const transactionRemove = event.target.closest(".transaction__remove");
      if (transactionRemove) {
        const { id } = transactionRemove.dataset;
        this.removeTransaction(id);
        event.preventDefault();
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const confirmMessage = window.confirm(
        "Вы действительно хотите удалить счёт?"
      );

      if (confirmMessage) {
        this.lastOptions = {
          id: this.lastOptions.account_id,
        };
        Account.remove(this.lastOptions, (err, response) => {
          if (response && response.success) {
            App.updateWidgets();
          } else {
            console.log(err);
          }
        });
        this.clear();
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (window.confirm("Вы действительно хотите удалить эту транзакцию?")) {
      Transaction.remove(id, (err, response) => {
        if (response && response.success) {
          App.update();
        } else {
          console.log(err);
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }

    this.lastOptions = options;

    Account.get(options["account_id"], (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      } else {
        console.log(err);
      }
    });

    Transaction.list(options, (err, response) => {
      if ((response, response.success)) {
        this.renderTransactions(response.data);
      } else {
        console.log(err);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счета");
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector(".content-title").innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let newDate = new Date(date),
    months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];

    let year = newDate.getFullYear(),
      month = months[newDate.getMonth()],
      day = newDate.getDay(),
      hours = newDate.getHours(),
      minutes = newDate.getMinutes();

    if (hours < 10) {
      hours = `0${hours}`;
    } else if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${day} ${month} ${year} в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let incomeExpense =
      item.type === "expense" ? "transaction_expense" : "transaction_income";
    let infoPage = document.createElement("div");
    return (infoPage.innerHTML = `
    <div class="transaction ${incomeExpense} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
        <span class="fa fa-money fa-2x"></span>
      </div>
  
      <div class="transaction__info">
        <h4 class="transaction__title">${item.name}</h4>
        <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
        ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
      <button class="btn btn-danger transaction__remove" data-id="${item.id}">
        <i class="fa fa-trash"></i>
      </button>
    </div>
  </div>
  `);
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = this.element.querySelector(".content");
    if (data) {
      content.innerHTML = "";

      for (let i = 0; i < data.length; i++) {
        content.innerHTML += this.getTransactionHTML(data[i]);
      }
    }
  }
}
