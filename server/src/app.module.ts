import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecipeModule } from './recipe/recipe.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EatingPlanModule } from './eating-plan/eating-plan.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      uploads: false,
      cors: false,
      // cors: {
      //   origin: 'http://localhost:5173',
      //   credentials: true,
      // },
      fieldResolverEnhancers: ['guards'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    UserModule,
    AuthModule,
    RecipeModule,
    EatingPlanModule,
  ],
})
export class AppModule {}
