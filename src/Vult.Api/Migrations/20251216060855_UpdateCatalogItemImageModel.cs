using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vult.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCatalogItemImageModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AltText",
                table: "CatalogItemImages");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "CatalogItemImages");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "CatalogItemImages");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "CatalogItemImages");

            migrationBuilder.RenameColumn(
                name: "ClothingType",
                table: "CatalogItems",
                newName: "ItemType");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "CatalogItems",
                newName: "CatalogItemId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "CatalogItemImages",
                newName: "CatalogItemImageId");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CatalogItemImages",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "CatalogItemImages",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "CatalogItemImages");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "CatalogItemImages");

            migrationBuilder.RenameColumn(
                name: "ItemType",
                table: "CatalogItems",
                newName: "ClothingType");

            migrationBuilder.RenameColumn(
                name: "CatalogItemId",
                table: "CatalogItems",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "CatalogItemImageId",
                table: "CatalogItemImages",
                newName: "Id");

            migrationBuilder.AddColumn<string>(
                name: "AltText",
                table: "CatalogItemImages",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "CatalogItemImages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "CatalogItemImages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "CatalogItemImages",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }
    }
}
