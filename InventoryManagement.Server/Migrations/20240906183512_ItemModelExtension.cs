using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class ItemModelExtension : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsNonConsumable",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsNonEquipment",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsNonIngredient",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsNonConsumable",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "IsNonEquipment",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "IsNonIngredient",
                table: "Items");
        }
    }
}
