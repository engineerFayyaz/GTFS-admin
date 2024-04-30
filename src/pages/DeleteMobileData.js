import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const DeleteMobileData = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://circularclientapi.azurewebsites.net/api/product-gen-categories");
      setCategories(response.data.results);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };



  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(`https://circularclientapi.azurewebsites.net/api/product-gen-categories/${categoryId}`);
      if (response.status === 200) {
        setCategories(categories.filter((category) => category.id !== categoryId));
        toast.success("Category deleted successfully!");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = async (categoryId, newType) => {
    try {
      const response = await axios.put("https://circularclientapi.azurewebsites.net/api/product-gen-categories", {
        id: categoryId,
        type: newType,
      });
      if (response.status === 200) {
        setCategories(categories.map((category) => (category.id === categoryId ? { ...category, type: newType } : category)));
        toast.success("Category updated successfully!");
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.error("Error updating category:", error);
    }
  };

  return (
    <>
      <main>
      <div className="container-fluid px-3 pt-4">
          <div className="text-center  ">
            <h2 className="text-uppercase p-2 page-title">
              Delete Data For Mobile Apps
            </h2>
          </div>
          <div className="row " >
            <div className="col-lg-12 p-3">
              {/* <div>
                <h2 className="text-center text-light">Create New Category</h2>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button className="btn btn-primary" type="button" onClick={handleCreateCategory}>
                    Create
                  </button>
                </div>
              </div> */}
              <hr />
              <div>
                <h2 className="text-center text-light">Admin Collections</h2>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.id}</td>
                          <td>{category.type}</td>
                          <td>
                            <button
                              className="btn btn-danger mx-1"
                              onClick={() => handleDelete(category.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn btn-primary mx-1"
                              onClick={() => {
                                const newType = prompt("Enter new type:");
                                if (newType !== null) {
                                  handleEdit(category.id, newType);
                                }
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default DeleteMobileData;
