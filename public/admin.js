const deleteProduct = (btn) => {
  const idd = btn.id.slice(1);
  console.log(idd);
  const newidd = "card-" + idd;
  const parent = document.getElementById(newidd);
  const csrf = parent.querySelector('[name="_csrf"]').value;
  console.log(csrf,idd);
  fetch("/admin/delete-product/" + idd, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      parent.parentNode.removeChild(parent);
    })
    .catch((err) => console.log(err));
};
