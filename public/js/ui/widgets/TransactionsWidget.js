/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error(
        `Класс TransactionsWidget!!! Элемент(ы) (${element}) отсутствует(ют)!`
      );
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const transactionsPanel = document.querySelector(".transactions-panel");
    transactionsPanel.addEventListener("click", (event) => {
      if (event.target.closest(".create-income-button")) {
        App.getModal("newIncome").open();
      } else if (event.target.closest(".create-expense-button")) {
        App.getModal("newExpense").open();
      }
    });
  }
}
