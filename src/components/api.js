const BASE_URL = "https://nomoreparties.co/v1/cohort-mag-4";

const apiRoutes = {
  user: "users/me",
  cards: "cards",
  likes: "likes",
};

const headers = {
  Authorization: "cf42a0df-ae43-4b9c-81ff-a75ec02c0ae1",
  "Content-Type": "application/json",
};

const checkData = (response) => {
  console.log("API Response status:", response.status, response.statusText);
  if (response.ok) {
    return response.json();
  } else {
    console.error("API Error:", response.status, response.statusText);
    return Promise.reject(`Error: ${response.status}`);
  }
};

function request(endpoint, options) {
  const url = `${BASE_URL}/${endpoint}`;
  console.log("Making API request to:", url, "with options:", options);
  return fetch(url, options)
    .then(checkData)
    .catch((error) => {
      console.error("Network error:", error);
      throw error;
    });
}

const getCards = () => {
  return request(apiRoutes.cards, {
    method: "GET",
    headers,
  });
};

const postCard = (name, link) => {
  return request(apiRoutes.cards, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      link,
    }),
  });
};

const deleteCardApi = (id) => {
  return request(`${apiRoutes.cards}/${id}`, {
    method: "DELETE",
    headers,
  });
};

const getUser = () => {
  return request(apiRoutes.user, {
    method: "GET",
    headers,
  });
};

const patchUser = (name, about) => {
  return request(apiRoutes.user, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      name,
      about,
    }),
  });
};

const addLikeCard = (id) => {
  return request(`${apiRoutes.cards}/${id}/${apiRoutes.likes}`, {
    method: "PUT",
    headers,
  });
};

const deleteLikeCard = (id) => {
  return request(`${apiRoutes.cards}/${id}/${apiRoutes.likes}`, {
    method: "DELETE",
    headers,
  });
};

const patchAvatar = (avatar) => {
  return request(`${apiRoutes.user}/avatar`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ avatar }),
  });
};

export {
  getCards,
  postCard,
  deleteCardApi,
  getUser,
  patchUser,
  addLikeCard,
  deleteLikeCard,
  patchAvatar,
};
