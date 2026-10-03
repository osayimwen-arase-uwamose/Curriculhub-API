import * as hubMembershipService from "../services/hubMembership.service.js";

const add = async (req, res) => {
  const data = req.validated;

  const membership = await hubMembershipService.addMember({
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

  const membership = await hubMembershipService.inviteMember({
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

  const membership = await hubMembershipService.approveMember(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const suspend = async (req, res) => { 
  const data = req.validated;

  const membership = await hubMembershipService.suspendMember(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const restore = async (req, res) => { 
  const data = req.validated;

  const membership = await hubMembershipService.restoreMember(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const remove = async (req, res) => { 
  const data = req.validated;

  await hubMembershipService.removeMember(
    data.hubId,
    data.userId
  );

  return res.status(204).send();
};

const changeRole = async (req, res) => {
    const data = req.validated;

    const membership = await hubMembershipService.changeMemberRole(
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

  const hub = await hubMembershipService.transferOwnership(
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

  const membership = await hubMembershipService.getMembership(
    data.hubId,
    data.userId
  );

  return res.status(200).json({
    data: membership,
  });
};

const list = async (req, res) => { 
  const data = req.validated;

  const result = await hubMembershipService.getMembers(
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
