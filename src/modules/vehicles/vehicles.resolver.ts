// Importa las herramientas base de GraphQL: Resolver (Controlador), Query (Consulta GET), Args (Parametros) y Context (Datos de la peticion web).
import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { VehicleType } from '../graphql/vehicle.type';
import { VehicleFiltersInput } from '../graphql/vehicle-filters.input';
import { VehiclePageType } from '../graphql/vehicle-page.type';
// Import de las herramientas para proteger rutas usando JWT
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException, UseGuards } from '@nestjs/common';

// Define que esta clase es el "Controlador" de GraphQL encargado de gestionar todo lo relacionado con el tipo "VehicleType".
@Resolver(() => VehicleType)
export class VehiclesResolver {
  // Inyecta el VehiclesService para poder usar los metodos que se conectan a la base de datos de MongoDB.
  constructor(private readonly vehiclesService: VehiclesService) {}

  // Crea una consulta GraphQL llamada 'vehicles' que retorna una lista (array) de objetos tipo VehicleType.
  @Query(() => [VehicleType], { name: 'vehicles' })
  // Esta es la funcion real de TypeScript que se ejecutara cuando alguien llame a vehicles
  async getAllVehicles() {
    return this.vehiclesService.getAllVehicles();
  }

  @Query(() => VehicleType, { name: 'vehicle', nullable: true })
  async getVehicleByStringQueryId(@Args('id') vehicleId: string) {
    return this.vehiclesService.getVehicleByStringQueryId(vehicleId);
  }

  @Query(() => VehiclePageType, { name: 'filteredVehicles' })
  async getFilteredVehicles(
    // Args para agarrar lo que manda el frontend. Y se hace callback para que no explote (callback perezoso) el servidor y que los filtros sean opciones
    @Args('filters', { type: () => VehicleFiltersInput, nullable: true })
    filters: VehicleFiltersInput,
    // Ya cargado la plantilla VehicleFiltersInput, lo que se espera de filters: son los datos que se definieron en VehicleFiltersInput, pero no es obligatorio mandarlos todos.
  ) {
    return this.vehiclesService.getFilteredVehicles(filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Query(() => [VehicleType], { name: 'myVehicles' })
  async getMyVehicles(
    // Context es para poder leer la peticion HTTP original ya que JWT lo esconde dentro de la peticion. Entonces con @Context()
    // puedo acceder a esa peticion y leer el token JWT para saber que usuario esta haciendo la consulta.
    @Context() context: { req: { user: { numberId: number } } },
  ) {
    const user = context.req.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.vehiclesService.getAllVehiclesByOwnerId(user.numberId);
  }
}
