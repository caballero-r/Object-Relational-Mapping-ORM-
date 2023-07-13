const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, ProductTag}],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, ProductTag}],
    });

    // This checks to see if the tag id exists. If it does not the user is provided with a message.
    if (!tag) {
      res.status(404).json({ message: 'No tag was found under this id. Please use existing tag id.' })
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagInfo = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // This checks to see if the tag id exists. If it does not the user is provided with a message.
    if (!tagInfo) {
      res.status(404).json({ message: 'No tag was found under this id. Please use existing tag id.' })
      return;
    }
    res.status(200).json({ message: 'Tag Name was successfully updated. Thank you!'});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const removed = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    // This checks to see if the tag id exists. If it does not the user is provided with a message.
    if (!removed) {
      res.status(404).json({ message: 'No tag was found under this id. Please use existing tag id.' })
      return;
    }
    res.status(200).json({ message: 'This tag has been successfully removed from database.'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
