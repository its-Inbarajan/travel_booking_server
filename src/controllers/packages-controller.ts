import { NextFunction, Request, Response } from "express";
import { IPackages } from "../@types/packagesType";
import { PACKAGESCHEMA } from "../models/packages-model";
import { CustomError } from "../middleware/global-error";
import { IApiResponse } from "../@types/apiResponse";
import { FilterQuery } from "mongoose";
import { catchAsync } from "../utility/helper";

export async function createPackage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    accommondation,
    base_price,
    end_date,
    from,
    posted_by,
    start_date,
    to,
    package_name,
  }: IPackages = req.body;
  try {
    const result = await PACKAGESCHEMA.create({
      accommondation,
      base_price,
      end_date,
      from,
      posted_by,
      start_date,
      to,
      package_name,
    });

    if (!result) {
      throw new CustomError("Something wrong!", 400);
    }

    const response: IApiResponse<IPackages> = {
      message: "Packages created successfully.",
      statuscode: 201,
      success: true,
      responses: result,
    };
    res.status(response.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPackages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const query: FilterQuery<IPackages> = {};
  const pipeline: any = [];
  const { search, status, page = 1, limit = 10 } = req.query;
  try {
    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);
    const currentDate = new Date();

    // If a search term is provided, add the search condition
    if (search) {
      query.$or = [
        { package_name: { $regex: new RegExp(search as string, "i") } },
      ];
    }

    // Apply filtering based on status (date logic)
    if (status) {
      if (status === "Completed") {
        // Completed: End Date < Today
        query.end_date = { $lt: currentDate };
      } else if (status === "Active") {
        // Active: Start Date ≤ Today AND End Date ≥ Today
        query.start_date = { $lte: currentDate };
        query.end_date = { $gte: currentDate };
      } else if (status === "Upcoming") {
        // Upcoming: Start Date > Today
        query.start_date = { $gt: currentDate };
      }
    }

    // If there are filtering conditions, add the match stage
    if (Object.keys(query).length > 0) {
      pipeline.push({ $match: query });
    }

    // Sort stage - sorting by start_date in ascending order
    pipeline.push({ $sort: { start_date: 1 } });

    // Pagination stages
    pipeline.push(
      { $skip: (pageNumber - 1) * pageLimit },
      { $limit: pageLimit }
    );

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "posted_by",
          foreignField: "_id",
          as: "posterDetails",
        },
      },
      {
        $unwind: {
          path: "$posterDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "booking_ids",
          foreignField: "_id",
          as: "bookedUsers",
        },
      },
      {
        $project: {
          package_name: 1,
          from: 1,
          to: 1,
          start_date: 1,
          end_date: 1,
          base_price: 1,
          posterDetails: {
            _id: 1,
            user_name: 1,
            email: 1,
            profile: 1,
          },
          bookedUsers: {
            _id: 1,
            user_name: 1,
            email: 1,
            profile: 1,
          },
        },
      }
    );

    const response = await PACKAGESCHEMA.aggregate(pipeline);
    const count = await PACKAGESCHEMA.countDocuments(query);

    const result: IApiResponse<IPackages[]> = {
      message: "Successfully fetched.",
      statuscode: 200,
      success: true,
      responses: response,
      pagination: {
        limit: pageLimit,
        page: pageNumber,
        totalCount: count,
      },
    };

    res.status(result.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updatePackage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const findPack = await PACKAGESCHEMA.findById(id);

    if (!findPack) {
      throw new CustomError("Package not found.", 404);
    }

    const response = await PACKAGESCHEMA.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!response) {
      throw new CustomError("Package not updated, please try again later", 400);
    }

    const result: IApiResponse<IPackages> = {
      message: "Package updated successfully",
      statuscode: 200,
      success: true,
      responses: response,
    };

    res.status(result.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}

export async function deletePackages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const findPack = await PACKAGESCHEMA.findById(id);

    if (!findPack) {
      throw new CustomError("Package not found.", 404);
    }

    const response = await PACKAGESCHEMA.findByIdAndDelete(id);

    if (!response) {
      throw new CustomError("Package not deleted, please try again later", 400);
    }

    const result: IApiResponse<IPackages> = {
      message: "Package deleted successfully",
      statuscode: 200,
      success: true,
    };

    res.status(result.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPackageById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const findPackage = await PACKAGESCHEMA.findById(id).populate({
      path: "booking_ids posted_by",
      select: "-__v -password -isVerifyed -user_type -googleId",
    });
    if (!findPackage) {
      throw new CustomError("Opps! data not found.", 400);
    }

    const response: IApiResponse<IPackages> = {
      message: "Successfully fetched package.",
      statuscode: 200,
      success: true,
      responses: findPackage,
    };
    res.status(response.statuscode).json(response);
  } catch (error) {
    next(error);
  }
}

export const getPackage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const findPackage = await PACKAGESCHEMA.findById(id).populate({
        path: "booking_ids posted_by",
        select: "-__v -password -isVerifyed -user_type -googleId",
      });
      if (!findPackage) {
        throw new CustomError("Opps! data not found.", 400);
      }

      const response: IApiResponse<IPackages> = {
        message: "Successfully fetched package.",
        statuscode: 200,
        success: true,
        responses: findPackage,
      };
      res.status(response.statuscode).json(response);
    } catch (error) {
      next(error);
    }
  }
);
