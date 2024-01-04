import React, { useRef } from "react";
import { useFormik } from "formik";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { convertToBase64 } from "../helpers/convert";
import "./style/addProducts.css";

function AddProducts() {
    const thumbRef = useRef();
    const token = localStorage.getItem("token");

    const formik = useFormik({
        initialValues: {
            thumbnail: null,
            title: "",
            stock: "",
            images: {},
            description: "",
            category: ""
        },
        onSubmit: async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("stock", values.stock);
            formData.append("description", values.description);
            formData.append("thumbnail", values.thumbnail);
            formData.append("category", values.category);
            Object.values(values.images).forEach(file => {
                formData.append("images", file);
            });

            const resPromise = axios.post("/api/add-products", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.promise(resPromise, {
                loading: "Uploading...",
                success: (res) => {
                    resetForm();
                    thumbRef.current.src = "/placeholder.jpg"; 
                    return res.data.msg;
                },
                error: (error) => error.response.data.msg
            });
        }
    });

    const handleThumbnail = (e) => {
        convertToBase64(e.target.files[0])
            .then(b64img => {
       
                console.log("HGHJ",b64img);
                formik.setFieldValue("thumbnail", b64img);
                
            })
            .catch(error => {
                console.error("Error converting file to base64", error);
            });
          
    };

    return (
        <section className="signup">
            <div className="container">
                <div className="signup-content">
                    <div className="signup-form">
                        <h2 className="form-title">Add Products</h2>
                        <form onSubmit={formik.handleSubmit} className="register-form" id="register-form">
                            <input onChange={handleThumbnail} className="ap" type="file" name="thumbnail" id="thumbnail" accept="image/*" /><br />
                            <div className="form-group">
                                <input {...formik.getFieldProps("title")} className="ap" type="text" name="title" id="title" placeholder="Title" /><br />
                            </div>
                            <div className="form-group">
                                <input {...formik.getFieldProps("description")} className="ap" name="description" id="description" placeholder="Description" /><br />
                            </div>
                            <div className="form-group">
                                <input {...formik.getFieldProps("category")} list="category-list" className="ap" name="category" id="category" placeholder="Category" /><br />
                            </div>
                            <div className="form-group">
                                <input {...formik.getFieldProps("stock")} type="number" className="ap" name="stock" id="stock" placeholder="Stock" /><br />
                            </div>
                            <div className="form-group">
                                <input onChange={e => formik.setFieldValue("images", e.target.files)} className="ap" type="file" name="images" id="images" accept="image/*" multiple /><br />
                            </div>
                            <div className="form-group form-button">
                                <input type="submit" className="ap" value="Add Product" />
                            </div>
                            <datalist id="category-list">
                                <option value="v1">Value1</option>
                                <option value="v2">Value2</option>
                            </datalist>
                        </form>
                    </div>
                    <div className="signup-image">
                        <div className="product-avatar-container">
                            <img src="/placeholder.jpg" alt="Product Thumbnail" ref={thumbRef} />
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </section>
    );
}

export default AddProducts;