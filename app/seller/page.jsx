'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {

  const { getToken } = useAppContext()

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AbroniaGraminea');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('name',name)
    formData.append('description',description)
    formData.append('category',category)
    formData.append('price',price)
    formData.append('offerPrice',offerPrice)

    for (let i = 0; i < files.length; i++) {
      formData.append('images',files[i])
    }

    // Show loading toast
    const loadingToast = toast.loading('Adding product... Please wait');

    try {

      const token = await getToken()

      const { data } = await axios.post('/api/product/add',formData,{headers:{Authorization:`Bearer ${token}`}})

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success('Product added successfully!')
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('AbroniaGraminea');
        setPrice('');
        setOfferPrice('');
      } else {
        toast.error(data.message);
      }


    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      toast.error(error.message)
    }


  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="AbroniaGraminea">Abronia Graminea</option>
              <option value="AbroniaLitrochilla">Abronia Lythrochila</option>
              <option value="AbroniaOaxacae">Abronia Oaxacae</option>
              <option value="AbroniaTaeniata">Abronia Taeniata</option>
              <option value="AbroniaAnzuetoi">Abronia Anzuetoi</option>
              <option value="AbroniaAurita">Abronia Aurita</option>
              <option value="AbroniaCampbelli">Abronia Campbell</option>
              <option value="AbroniaChiszari">Abronia Chiszari</option>
              <option value="AbroniaCuetzpali">Abronia Cuetzpali</option>
              <option value="AbroniaDeppii">Abronia Deppii</option>
              <option value="AbroniaFuscolabialis">Abronia Fuscolabialis</option>
              <option value="AbroniaMatudai">Abronia Matudai</option>
              <option value="AbroniaMartindelcampo">Abronia Martindelcampo</option>
              <option value="AbroniaMeledona">Abronia Meledona</option>
              <option value="AbroniaMixtecd">Abronia Mixteca</option>
              <option value="AbroniaOchroteaf">Abronia Ochoterenai</option>
              <option value="AbroniaRamirez">Abronia Ramirezi</option>
              <option value="AbroniaReynae">Abronia Reynae</option>
              <option value="AbroniaSmithii">Abronia Smithii</option>
              <option value="AbroniaVasconcelosi">Abronia Vasconcelosi</option>

              <option value="Enclosures">Enclosures</option>
              <option value="Feeders">Feeders</option>
              <option value="Shipping">Shipping Supplies</option>
              <option value="Accessories">Accessories</option>
              <option value="OtherReptiles">Other Reptiles</option>
              
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;