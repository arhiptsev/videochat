import { ApiProperty } from "@nestjs/swagger";

export class UserProfile {
    @ApiProperty()
    username: string;
    @ApiProperty()
    email: string;
}
