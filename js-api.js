const API_URL = "http://localhost:3000/api/items";
const itemList = document.getElementById("list");
const newItemInput = document.getElementById("new");


async function fetchItems() {
    try {
        const response = await fetch(API_URL);
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}


function renderItems(items) {
    itemList.innerHTML = ""; 
    items.forEach(item => {
        const listItem = document.createElement("li");

        
        const nameSpan = document.createElement("span");
        nameSpan.textContent = item.name;
        nameSpan.style.marginRight = "10px";

        
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.marginRight = "5px";
        editButton.addEventListener("click", () => editItem(item, nameSpan));

      
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteItem(item.id));

        
        listItem.appendChild(nameSpan);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        itemList.appendChild(listItem);
    });
}


async function addItem() {
    const newItemName = newItemInput.value.trim();
    if (!newItemName) {
        alert("Please enter a name!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newItemName })
        });

        if (!response.ok) {
            throw new Error("Failed to add item");
        }

        await fetchItems(); 
        newItemInput.value = ""; 
    } catch (error) {
        console.error("Error adding item:", error);
    }
}


async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete item");
        }

        fetchItems(); 
    } catch (error) {
        console.error("Error deleting item:", error);
    }
}

// Edit an item
async function editItem(item, nameSpan) {
    const newName = prompt("Edit name:", item.name);
    if (!newName) {
        return; 
    }

    try {
        const response = await fetch(`${API_URL}/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName })
        });

        if (!response.ok) {
            throw new Error("Failed to edit item");
        }


        nameSpan.textContent = newName;
    } catch (error) {
        console.error("Error editing item:", error);
    }
}


document.getElementById("add-button").addEventListener("click", addItem);

fetchItems();
