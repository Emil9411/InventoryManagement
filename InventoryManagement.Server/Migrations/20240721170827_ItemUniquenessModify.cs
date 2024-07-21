using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class ItemUniquenessModify : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Items_Name",
                table: "Items");

            migrationBuilder.CreateIndex(
                name: "IX_Items_Name_InventoryId",
                table: "Items",
                columns: new[] { "Name", "InventoryId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Items_Name_InventoryId",
                table: "Items");

            migrationBuilder.CreateIndex(
                name: "IX_Items_Name",
                table: "Items",
                column: "Name",
                unique: true);
        }
    }
}
