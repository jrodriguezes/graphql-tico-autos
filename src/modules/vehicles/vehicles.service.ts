import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { Model } from 'mongoose';
import { VehicleFiltersInput } from '../graphql/vehicle-filters.input';

type TextFilter = {
  $regex: string;
  $options: 'i';
};

type RangeFilter = {
  $gte?: number;
  $lte?: number;
};

type VehicleQuery = {
  brand?: TextFilter;
  model?: TextFilter;
  year?: RangeFilter;
  price?: RangeFilter;
  status?: TextFilter;
};

@Injectable()
export class VehiclesService {
  constructor(
    // Se inyecta el modelo de Mongoose
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) {}

  async getAllVehicles() {
    return this.vehicleModel.find().exec();
  }

  async getVehicleByStringQueryId(vehicleId: string) {
    return await this.vehicleModel.findById(vehicleId);
  }

  async getFilteredVehicles(dto: VehicleFiltersInput) {
    const query: VehicleQuery = {};

    if (dto.brand) {
      query.brand = { $regex: dto.brand, $options: 'i' }; // $regex operador de mongo para que busque coincidencia en la bd, $options = case-insensitve
    }

    if (dto.model) {
      query.model = { $regex: dto.model, $options: 'i' };
    }

    if (dto.minYear || dto.maxYear) {
      query.year = {};
      if (dto.minYear) {
        query.year.$gte = dto.minYear;
      }
      if (dto.maxYear) {
        query.year.$lte = dto.maxYear;
      }
    }

    if (dto.minPrice || dto.maxPrice) {
      query.price = {};
      if (dto.minPrice) {
        query.price.$gte = dto.minPrice;
      }
      if (dto.maxPrice) {
        query.price.$lte = dto.maxPrice;
      }
    }
    if (dto.status) {
      query.status = { $regex: dto.status, $options: 'i' };
    }

    const page = dto.page || 1;
    const limit = dto.limit || 8;
    const skip = (page - 1) * limit;

    const total = await this.vehicleModel.countDocuments(query);
    const data = await this.vehicleModel.find(query).skip(skip).limit(limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllVehiclesByOwnerId(ownerId: number) {
    return this.vehicleModel.find({ ownerId: ownerId }).exec();
  }
}
