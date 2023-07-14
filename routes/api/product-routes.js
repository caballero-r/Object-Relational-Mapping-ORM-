const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [{ model: Category}, { model: Tag, through: ProductTag}],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category}, { model: Tag, through: ProductTag}],
    });

    // This checks to see if the product id exists. If it does not the user is provided with a message.
    if (!product) {
      res.status(404).json({ message: 'No product was found under this id. Please use existing product id.' })
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }

});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  const { body: { product_name, price, stock} } = req; 
  try {
    const newProduct = await Product.create({
      product_name, price, stock
    })
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }

      // This checks to see if the product id exists. If it does not the user is provided with a message.
      if (!newProduct) {
        res.status(404).json({ message: 'No product was found under this id. Please use existing product id.' })
        return;
      }

      // if no product tags, just respond
      res.status(200).json({ message: 'The new product was successfully created. Thank you!'})
  } catch (err) {
      console.log(err);
      res.status(400).json(err);
    };
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    const productInfo = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },  
    });

      if (req.body.tagIds && req.body.tagIds.length) {
         ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      // This checks to see if the product id exists. If it does not the user is provided with a message.
      if (!productInfo) {
        res.status(404).json({ message: 'No product was found under this id. Please use existing product id.' })
        return;
      }

      res.status(200).json({ message: 'Product Info was successfully updated. Thank you!'});
    } catch (err) {
      // console.log(err);
      res.status(400).json(err);
    };
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const removed = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    // This checks to see if the product id exists. If it does not the user is provided with a message.
    if (!removed) {
      res.status(404).json({ message: 'No product was found under this id. Please use existing product id.' })
      return;
    }
    res.status(200).json({ message: 'This product has been successfully removed from database.'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
