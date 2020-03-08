const { sequelize, User, Project } = require('../lib/db');
const { Router } = require('express');

const router = Router();

router.get('/:id', async (req, res) => {
  const list = await User.findOne({
    where: { id: req.params.id }
    , include: [
      { model: Project, required: false }
    ]
  });
  res.json(list);
});


router.get('/', async (req, res) => {
  const result = req.query;
  const offset = result.offset || 0;
  const limit = result.limit || 10;

  const list = await User.findAndCountAll({
    distinct: true, // sub table 이 있을경우 count 를 메인 테이블 기준으로 조회를 위해 설정
    where: {}
    , include: [
      { model: Project, required: false }
    ], offset, limit
  });
  res.json(list);
});


router.post('/', async (req, res) => {
  const data = req.body;
  const user = await User.build(data).save();
  if (data.projects) {
    for (const project of data.projects) {
      let prjData = {
        user_id: user.id,
        name: project.name,
      };
      await Project.build(prjData).save();
    }
  }
  res.status(200).end();
});

router.put('/', async (req, res) => {
  const data = req.body;
  const user = await User.findOne({
    where: { id: data.id }
  });
  await user.update(data);
  await Project.destroy({ where: { user_id: user.id } });
  if (data.projects) {
    for (const project of data.projects) {
      let prjData = {
        user_id: user.id,
        name: project.name,
      };
      await Project.build(prjData).save();
    }
  }
  res.status(200).end();
});


router.delete('/', async (req, res) => {
  const user = req.body;
  await User.destroy({ where: { id: user.id } });
  await Project.destroy({ where: { user_id: user.id } });

  res.status(204).end();
});

module.exports = router;