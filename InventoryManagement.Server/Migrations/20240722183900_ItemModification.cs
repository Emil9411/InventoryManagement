using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class ItemModification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuantityUnit",
                table: "Items");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                table: "Items",
                newName: "WeightInGrams");

            migrationBuilder.AddColumn<double>(
                name: "GrossPricePerGram",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GrossPricePerKilogram",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GrossPricePerPackage",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GrossPricePerPiece",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NetPricePerGram",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NetPricePerKilogram",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NetPricePerPackage",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NetPricePerPiece",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "QuantityInPieces",
                table: "Items",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "TaxRate",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "WeightInKilograms",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GrossPricePerGram",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "GrossPricePerKilogram",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "GrossPricePerPackage",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "GrossPricePerPiece",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "NetPricePerGram",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "NetPricePerKilogram",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "NetPricePerPackage",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "NetPricePerPiece",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "QuantityInPieces",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "TaxRate",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "WeightInKilograms",
                table: "Items");

            migrationBuilder.RenameColumn(
                name: "WeightInGrams",
                table: "Items",
                newName: "Quantity");

            migrationBuilder.AddColumn<string>(
                name: "QuantityUnit",
                table: "Items",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
