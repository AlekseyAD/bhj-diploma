/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  //console.log(options);
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  options.method === "GET";
  //console.log(options.data);
  //console.log(options.url);
  let requestAddress = `${options.url}` + "?";
  //console.log(requestAddress);
  for (let i in options.data) {
    requestAddress += `${i}=${options.data[i]}&`;
    //console.log(requestAddress);
  }

  const formData = new FormData();
  for (let i in options.data) {
    formData.append(i, options.data[i]);
  }
  //console.log(requestAddress);
  try {
    xhr.open(options.method, requestAddress);
    xhr.send(formData);
  } catch (err) {
    options.callback(err);
    //console.log(err);
  }

  xhr.onload = () => {
    if (xhr.status === 200) {
      options.callback(xhr.err, xhr.response);
      //console.log(xhr.response);
    }
  };

  xhr.onerror = () => {
    options.callback(xhr.response.error, xhr.response);
    //console.log(xhr.response);
  };
};
