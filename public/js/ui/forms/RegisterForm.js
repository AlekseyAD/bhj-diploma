/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    //console.log(data);

    User.register(data, (err, response) => {
      let error = response.error;
      if (response.success) {
        this.element.reset();
        App.setState("user-logged");
        App.getModal("register").close();
      } else {
        alert(`Внимание! Ошибка регистрации! ${response.error}!`);
        console.log(err);
        console.log(response.error);
      }
    });
  }
}
