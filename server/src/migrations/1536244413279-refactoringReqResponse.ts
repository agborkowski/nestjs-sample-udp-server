// tslint:disable:max-line-length
// tslint:disable:class-name
// tslint:disable:quotemark

import {MigrationInterface, QueryRunner} from 'typeorm';

export class refactoringReqResponse1536244413279 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `activity` CHANGE `process_id` `process_id` int NULL");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `name` `name` enum ('REQUEST_CHECK_HASH', 'REQUEST_ADMIN_HELP', 'REQUEST_SET_PERMISSION', 'UNKNOWN', 'ALLOW', 'DENNY') NULL");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `from` `from` enum ('CLIENT', 'SERVER') NULL");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `process` CHANGE `status` `status` enum ('UNKNOWN', 'ALLOW', 'DENY') NOT NULL DEFAULT 'UNKNOWN'");
        await queryRunner.query("ALTER TABLE `process` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `process` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `process` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT 'current_timestamp(6)'");
        await queryRunner.query("ALTER TABLE `process` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT 'current_timestamp(6)'");
        await queryRunner.query("ALTER TABLE `process` CHANGE `status` `status` enum ('NEW', 'ALLOW', 'DENY') CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NOT NULL DEFAULT ''NEW''");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT 'current_timestamp(6)'");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT 'current_timestamp(6)'");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `from` `from` enum ('CLIENT', 'SERVER') NULL");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `name` `name` enum ('REQUEST_CHECK_HASH', 'REQUEST_ADMIN_HELP', 'REQUEST_SET_PERMISSION', 'UNKNOWN', 'ALLOW', 'DENNY') NULL");
        await queryRunner.query("ALTER TABLE `activity` CHANGE `process_id` `process_id` int NULL");
    }

}
