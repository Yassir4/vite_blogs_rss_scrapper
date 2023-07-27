const endpoint_url = import.meta.env.VITE_URL

let data = []
  
// workaround to make it work with innerHtml
window.deleteBlog = (id, authorIndex) => {
  console.log({id})
  deleteArticle(id)

  let newArticles = data[authorIndex].articles.filter((article) => article.id !== id)

  data[authorIndex].articles = newArticles
  
  displayBlogs()
}

function displayBlogs() {
  
  let list = ``
  data.forEach((item, author_index) => {
    if(item.articles.length > 0){

      let output = ``

      item.articles.forEach((article) => {
        output+= `
        <div id="blog_item_wrapper">
        <div id="delete_button"  onClick="window.deleteBlog(${article.id}, ${author_index})"><p id="x_text">x</p></div>
        <div id="blog_item" onClick="window.open('${article.link}');">
            <p id="blog_title">
              ${article.title}                 
            </p>
          </div>
        </div>
        `
      })
      list+= `
        <div>
          <h3 id="author_title">${item.author.name}</h3>
          <div id="blogs">
          ${output}
        </div>
      `
    }
  })
    document.querySelector('#app').innerHTML = list
    
}


export function fetchBlogs() {
    // URL to fetch data from
    const url = `${endpoint_url}/data`;
    // const url = 'http://localhost:3000/data';

    // Fetch the data using the fetch() function
    fetch(url, {
      method: 'get',
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the response as JSON
            return response.json();
        })
        .then(result => {
          data = result.data
          displayBlogs()
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error:', error);
        });
}


export function deleteArticle(id) {
  // URL to fetch data from
  const url = `${endpoint_url}/delete/${id}`;
  let originalData = JSON.parse(JSON.stringify(data))

  let revertChanges = () => {
    data = originalData
    displayBlogs()
  }
  // Fetch the data using the fetch() function
  fetch(url, {
    method: 'post',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  })
      .then(response => {
          if (!response.ok) {
              revertChanges()
              throw new Error('Network response was not ok');
          }
          // Parse the response as JSON
          return response.json();
      })
      .then(result => {
        if(result.errors) {
          revertChanges()
        }
      })
      .catch(error => {
          // Handle any errors that occurred during the fetch
          revertChanges()
      });
}

