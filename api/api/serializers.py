from django.core.exceptions import ValidationError
from rest_framework import serializers

from rest_framework.authtoken.models import Token
from rest_framework.fields import SerializerMethodField

from api.models import User, Grupos, Sites
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers


class SitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sites
        fields = '__all__'


class GrupoSerializer(serializers.ModelSerializer):
    grupo_id = serializers.CharField(source='id', required=False)

    class Meta:
        model = Grupos
        fields = ('id', 'grupo', 'quantidade_usuarios', 'grupo_id', 'isGrupoOpen')


class UserSerializer(serializers.ModelSerializer):
    grupo = serializers.CharField(
        required=False, allow_null=True, allow_blank=True)

    email = serializers.CharField(required=True)
    username = serializers.CharField(required=True)

    try:
        grupo_id = User.objects.values_list('grupo_id', flat=True).first()
    except:
        print("Tabela Grupos vazia")

    class Meta:
        model = User

        # fields = '__all__'
        fields = ('id', 'username', 'email', 'grupo', 'grupo_id')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        user = User(password=username,
                    email=email)
        user.set_password(password)
        user.save()
        return user


class CadastroSerializer(serializers.ModelSerializer):
    grupo = serializers.CharField(
        required=False, allow_null=True, allow_blank=True)

    email = serializers.CharField(required=False)
    username = serializers.CharField(required=False)

    try:
        grupo_id = User.objects.values_list('grupo_id', flat=True).first()
    except:
        print("Tabela Grupos vazia")

    class Meta:
        model = get_user_model()

        fields = '__all__'
        # fields = ('id', 'username', 'email', 'grupo', 'grupo_id')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        user = User(password=username,
                    email=email)
        user.set_password(password)
        user.save()
        return user


class UpdateSerializer(serializers.ModelSerializer):
    email = serializers.CharField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)

    # grupoid = CustomUser.objects.values_list('grupo_id', flat=True).first()

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data);
        Token.objects.create(user=user)
        return user

    """
    def validate_grupoid(self, data):
        userExist = CustomUser.objects.all().exists()

        if userExist:
            raise serializers.ValidationError("finish must occur after start")
        return "Error"""
