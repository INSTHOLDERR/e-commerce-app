import productsModel from "../models/products.model.js";


export async function addProduct(req, res) {
    try {
        let { title, stock, description,thumbnail, category } = req.body;
        let {  images } = req.files;
        console.log(category); 
        console.log(title);
        // thumbnail = thumbnail[0].filename;
        images = images.map(item => item.filename);
        await productsModel.create({
            title,
            thumbnail,
            stock,
            description,
            images,
            category
        })
        return res.status(201).json({
            msg: "Data resived!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Error occured!"
        })
    }
}

export async function getProducts(req, res) {
    try {

        
        let { limit = 100, sort = 'title', skip = 0, category, select } = req.query;

        limit = parseInt(limit, 10);
        skip = parseInt(skip, 10);

        const filter = category ? { category } : {};

        const projection = select ? { [select]: 1 } : {};

        const products = await productsModel.find(filter, projection)
            .limit(limit)
            .skip(skip)
            .sort({ [sort]: 1 });

        if (products.length === 0) {
            return res.status(204).json({
                msg: "There are no products to show!",
                products: []
            });
        }

        return res.status(200).json({
            msg: `${products.length} Product(s) found`,
            products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "An error occurred!",
            error: error.message
        });
    }
}



export async function viewProducts(req, res) {
    try {
      const { productId } = req.params;
    //   console.log("jhgsdhj", req.params);
  
      let product = await productsModel.findOne({ _id: productId });
      console.log("hftffyt", product);
  
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
  
      return res.status(200).json({
        msg: 'Product found',
        product,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'An error occurred!',
        error: error.message,
      });
    }
  }
  