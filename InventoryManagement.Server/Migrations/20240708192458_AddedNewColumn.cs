using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedNewColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFoodOrDrink",
                table: "Restaurant3",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFoodOrDrink",
                table: "Restaurant2",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFoodOrDrink",
                table: "Restaurant1",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFoodOrDrink",
                table: "Restaurant3");

            migrationBuilder.DropColumn(
                name: "IsFoodOrDrink",
                table: "Restaurant2");

            migrationBuilder.DropColumn(
                name: "IsFoodOrDrink",
                table: "Restaurant1");
        }
    }
}
