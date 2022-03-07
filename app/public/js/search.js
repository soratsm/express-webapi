const searchModule = (() => {
  const BASE_URL = "http://localhost:3000/api/v1/search";

  return {
    searchUsers: async () => {
      // 検索窓への入力値を取得
      const query = document.getElementById("search").value;

      const res = await fetch(BASE_URL + "?q=" + query);
      const result = await res.json();

      let body = "";

      for (let i = 0; i < result.length; i++) {
        const user = result[i];
        body += `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.dateOfBirth}</td>
                        <td>${user.createdAt}</td>
                        <td>${user.updatedAt}</td>
                  </tr>`;
      }

      document.getElementById("users-list").innerHTML = body;
    },
  };
})();
