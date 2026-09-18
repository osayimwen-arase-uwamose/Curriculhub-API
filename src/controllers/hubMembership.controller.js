import {
  addMember,
  inviteMember,
  approveMember,
  suspendMember,
  restoreMember,
  removeMember,
  changeMemberRole,
  transferOwnership,
  getMembership,
  getMembers,
} from "../services/hubMembership.service.js";

const add = async (req, res) => {
  const data = req.validated;

  const membership = await addMember({
    hubId: data.hubId,
    userId: data.userId,
    invitedBy: req.user.id,
    role: data.role,
  });

  return res.status(201).json({
    data: membership,
  });
};

const invite = async (req, res) => {
  const data = req.validated;

  const membership = await inviteMember({
    hubId: data.hubId,
    userId: data.userId,
    invitedBy: req.user.id,
  });

  return res.status(201).json({
    data: membership,
  });
};

const approve = async (req, res) => {
  const data = req.validated;

  const membership = await approveMember(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const suspend = async (req, res) => { 
  const data = req.validated;

  const membership = await suspendMember(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const restore = async (req, res) => { 
  const data = req.validated;

  const membership = await restoreMember(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const remove = async (req, res) => { 
  const data = req.validated;

  await removeMember(
    data.hubId,
    data.userId
  );

  return res.status(204).send();
};

const changeRole = async (req, res) => {
    const data = req.validated;

    const membership = await changeMemberRole(
      data.hubId,
      data.userId,
      data.role
    );

    return res.status(200).json({
      data: membership,
    });
};

const transferOwner = async (req, res) => { 
  const data = req.validated;

  const hub = await transferOwnership(
    data.hubId,
    req.user.id,
    data.newOwnerId
  );

  return res.status(200).json({
    data: hub,
  });
};

const getMembership = async (req, res) => { 
  const data = req.validated;

  const membership = await getMembership(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const list = async (req, res) => { 
  const data = req.validated;

  const result = await getMembers(
    data.hubId,
    { 
      page: data.page,
      limit: data.limit,
      status: data.status
    }
  );

  return res.status(200).json({
    data: result,
  });
};

export { 
  add,
  invite,
  approve,
  suspend,
  restore,
  remove,
  changeRole,
  transferOwner,
  getMembership,
  list,
};
