const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include: [{ model: Product}],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product}],
    });

    // This checks to see if the category id exists. If it does not the user is provided with a message.
    if (!category) {
      res.status(404).json({ message: 'No category was found under this id. Please use existing category id.' })
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryInfo = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // This checks to see if the category id exists. If it does not the user is provided with a message.
    if (!categoryInfo) {
      res.status(404).json({ message: 'No category was found under this id. Please use existing category id.' })
      return;
    }
    res.status(200).json({ message: 'Category Name was successfully updated. Thank you!'});
  } catch (err) {
    res.status(500).json(err);
  }

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const removed = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    // This checks to see if the category id exists. If it does not the user is provided with a message.
    if (!removed) {
      res.status(404).json({ message: 'No category was found under this id. Please use existing category id.' })
      return;
    }
    res.status(200).json({ message: 'This category has been successfully removed from database.'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
